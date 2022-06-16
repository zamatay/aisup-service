import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ImportService } from "./import.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt-auth-guard";
import { ImportDataDto, ImportResulDataDto } from "./dto/import-data-dto";

@ApiTags('Функции импорта')
@UseGuards(JwtAuthGuard)
@Controller('api/import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @ApiOperation({ summary: 'Импорт платежей из 1С в АИСУП' })
  @ApiResponse({ status: 200, description: 'возвращает количество добавленных записей', type: ImportResulDataDto})
  @Post('payFrom1C')
  async payFrom1C(@Body() body: ImportDataDto): Promise<ImportResulDataDto | boolean>{
    return await this.importService.payFrom1C(body);
  }

  @ApiOperation({ summary: 'Импорт заявок из 1С в АИСУП' })
  @ApiResponse({ status: 200, description: 'возвращает количество добавленных записей', type: ImportResulDataDto})
  @Post('rpFrom1C')
  async rpFrom1C(@Body() body: ImportDataDto): Promise<Record<string, number> | boolean>{
    return await this.importService.rpFrom1C(body);
  }

}
