import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/jwt-auth-guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommonService } from "./common.service";

@UseGuards(JwtAuthGuard)
@ApiTags('Общий')
@Controller('api/common')
export class CommonController {

    constructor(readonly commonService: CommonService) {
    }

    @ApiOperation({ summary: 'Получение персонала'})
    @ApiResponse({ status: 200, description: 'Возвращает набор записей из персонала'})
    @Get('getStaffs')
    async getStaffs(@Query() params: any): Promise<boolean> {
        return await this.commonService.getStaff(params);
    }

}
