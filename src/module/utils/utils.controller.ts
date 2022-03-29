import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { UtilsService } from './utils.service';
import { FirmDto } from "../../dto/firm-dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../jwt-auth-guard";

@ApiTags('Общие функции')
@UseGuards(JwtAuthGuard)
@Controller('api/utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @ApiOperation({ summary: 'Полученик субъектов учета по id пользователя' })
  @ApiResponse({ status: 200, description: 'Получение записей', type: FirmDto, isArray: true})
  @Get('getFirmsByUserID')
  async getFirmsByLogin(@Query('user_id') user_id: number): Promise<Promise<FirmDto[]> | any>{
    return await this.utilsService.getFirmsByUserId(user_id);
  }

}
