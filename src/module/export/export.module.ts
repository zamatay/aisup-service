import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [ExportController],
  providers: [ExportService],
  imports: [AuthModule]
})
export class ExportModule {}
