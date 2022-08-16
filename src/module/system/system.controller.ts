import { Controller, Get, Query, StreamableFile } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { createReadStream } from "fs";
import { BaseService } from "../../services/base.service";
import { SambaService } from "./samba.service";
import { FileService } from "./file.service";

@ApiTags('Системные функции')
@Controller('api/system')
export class SystemController extends BaseService{

    constructor(props, protected readonly sambaService: SambaService, protected readonly fileService: FileService) {
        super(props);
    }

    @ApiOperation({ summary: 'Получение файла по id в базе' })
    @ApiResponse({ status: 200, description: 'Возвращает содержимое файла' })
    @Get('fileById')
    async getFileById(@Query('id') id: number): Promise<StreamableFile> {
        const fileName = await this.fileService.getFileNameByID(id);
        const readStream = await this.sambaService.readFile(fileName);//createReadStream(await this.sambaService.readFile(fileName));
        return new StreamableFile(readStream);
    }
}
