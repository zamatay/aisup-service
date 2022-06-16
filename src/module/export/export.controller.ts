import { Controller, UseGuards } from "@nestjs/common";
import { ExportService } from "./export.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt-auth-guard";

@ApiTags('Функции экспорта')
@UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

}
