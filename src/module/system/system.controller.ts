import { Controller, Get, Query, Res, StreamableFile } from "@nestjs/common";
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
    async getFileById(@Query('id') id: number, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
        const fileName = await this.fileService.getFileNameByID(id);
        const file = encodeURIComponent(fileName.split('\\').slice(-1)[0]);
        const readStream = await this.sambaService.readFile(fileName);//createReadStream(await this.sambaService.readFile(fileName));
        res.set({
            'Content-Disposition': `attachment; filename="${file}"`,
        });
        //res.setHeader("Content-disposition",`attachment; filename=${file}`);
        return new StreamableFile(readStream/*, {disposition: `filename=${file}`}*/);
    }
}
