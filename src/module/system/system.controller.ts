import { Controller, Get, NotFoundException, Query, Res, StreamableFile } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { createReadStream } from "fs";
import { BaseService } from "../../services/base.service";
import { SambaService } from "./samba.service";
import { FileService } from "./file.service";
import { Response } from "express";

@ApiTags('Системные функции')
@Controller('api/system')
export class SystemController extends BaseService{

    constructor(props, protected readonly sambaService: SambaService, protected readonly fileService: FileService) {
        super(props);
    }

    @ApiOperation({ summary: 'Получение файла по id в базе' })
    @ApiResponse({ status: 200, description: 'Возвращает содержимое файла' })
    @Get('fileById')
    async fileById(@Query('id') id: number, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
        const fileName = await this.fileService.getFileNameByID([id]);
        if (fileName && fileName.length){
            try {
                const file = encodeURIComponent(fileName[0].split('\\').slice(-1)[0]);
                const readStream = await this.sambaService.readFile(fileName[0]);//createReadStream(await this.sambaService.readFile(fileName));
                res.set({
                    'Content-Disposition': `attachment; filename="${file}"`,
                });
                return new StreamableFile(readStream);
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
}
