import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [ImportController],
  providers: [ImportService],
  imports: [AuthModule]
})
export class ImportModule {}
