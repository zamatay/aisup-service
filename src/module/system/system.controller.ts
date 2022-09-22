import { Body, Controller, Get, NotFoundException, Post, Query, Res, StreamableFile, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseService } from "../../services/base.service";
import { SambaService } from "./samba.service";
import { FileService } from "./file.service";
import { Response } from "express";
import { JwtAuthGuard } from "../../guards/jwt-auth-guard";
import { SystemService } from "./system.service";
import { AddCommentDto, CommentDto } from "../../dto/comment-dto";

@UseGuards(JwtAuthGuard)
@ApiTags('Системные функции')
@Controller('api/system')
export class SystemController extends BaseService{

    constructor(props, protected readonly sambaService: SambaService, protected readonly fileService: FileService, protected readonly systemService: SystemService) {
        super(props);
    }

    @ApiOperation({ summary: 'Получение файла по id в базе' })
    @ApiResponse({ status: 200, description: 'Возвращает содержимое файла' })
    @Get('fileById')
    async fileById(@Query('id') id: number): Promise<StreamableFile> {
        const fileName = await this.fileService.getFileNameByID([id]);
        if (fileName) {
            if (fileName.length) {
                try {
                    const mime = require('mime-types');
                    const file = encodeURIComponent(fileName[0].split("\\").slice(-1)[0]);
                    const readStream = await this.sambaService.readFile(fileName[0]);
                    return new StreamableFile(readStream, {
                        type: mime.contentType(fileName[0]),
                        disposition: `filename="${file}"`,
                        length: readStream.fileSize
                    });
                } catch (e) {
                    //throw new NotFoundException({ message: "Файл не найден" })
                }
            } else throw new NotFoundException({ message: "Файл не найден" });
        } else throw new NotFoundException({ message: "Файл не найден" });
    }

    @ApiOperation({ summary: 'Получение потока файла по id в базе' })
    @ApiResponse({ status: 200, description: 'Возвращает содержимое файла' })
    @Get('file')
    async file(@Query('id') id: number, @Res({ passthrough: true }) res: Response) {
        const fileName = await this.fileService.getFileNameByID([id]);
        if (fileName && fileName.length){
            try {
                const mime = require('mime-types');
                const file = encodeURIComponent(fileName[0].split("\\").slice(-1)[0]);
                const readStream = await this.sambaService.readStream(fileName[0]);
                res.set({
                    'Content-Type': mime.contentType(fileName[0]),
                    'Content-Disposition': `attachment; filename="${file}"`,
                    'Content-Length': readStream.fileSize,
                });
                readStream.pipe(res);
                // return new StreamableFile(readStream, {
                //     type: mime.contentType(fileName[0]),
                //     disposition: `filename="${file}"`,
                //     length: readStream.fileSize
                // });
            } catch (e){
                throw new NotFoundException({ message: "Файл не найден" })
            }
        } else
            throw new NotFoundException({ message: "Файл не найден" })
    }

    @ApiOperation({ summary: 'Получение имени файла' })
    @ApiResponse({ status: 200, description: 'Возвращает имя по его id' })
    @Get('fileNameById')
    async fileNameById(@Query('id') id: number[]): Promise<any> {
        try {
            const filesFull = await this.fileService.getFileNameByID(id);
            return filesFull.map(item=>item.split('\\').slice(-1)[0])
        }catch (e) {
            throw new NotFoundException({ message: "Файл не найден" })
        }
    }

    @ApiOperation({ summary: 'Получение комментариев' })
    @ApiResponse({ status: 200, description: 'Возвращает список комментариев по id объекта и по id записи', type: CommentDto, isArray: true})
    @Get('comments')
    async comments(@Query('object_id') object_id: number, @Query('id') id: number): Promise<CommentDto[] | false> {
        return await this.systemService.getComments(object_id, id);
    }

    @ApiOperation({ summary: 'Добавление комментария'})
    @ApiResponse({ status: 200, description: 'Возвращает true если комментарий вставлен', type: CommentDto})
    @Post('addComment')
    async addComment(@Body() params: AddCommentDto): Promise<CommentDto | false> {
        return await this.systemService.addComment(params);
    }

    @ApiOperation({ summary: 'Получение данных из таблицы'})
    @ApiResponse({ status: 200, description: 'Возвращает набор записей из таблицы'})
    @Get('getData')
    async getData(@Query() params: any): Promise<boolean> {
        return await this.systemService.getData(params);
    }
}
