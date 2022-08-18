import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IRegDocument } from "../reg-doc/dto/document-dto";
import { SendRoistatService } from "./send-roistat.service";

@ApiTags('Роистат')
@Controller('api/roistat')
export class SendRoistatController {

    constructor(protected readonly roistatService: SendRoistatService ) {
    }


    @ApiOperation({ summary: 'Отправка наших статусов в роистат' })
    @ApiResponse({ status: 200, description: 'Возвращает success если статусы выгрузились'})
    @Get('sendStatus')
    async documents(): Promise<any[]>{
        return await this.roistatService.sendStatus();
    }

}
