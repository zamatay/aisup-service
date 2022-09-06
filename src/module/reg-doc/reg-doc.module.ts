import { Module } from '@nestjs/common';
import { RegDocController } from './reg-doc.controller';
import { RegDocService } from './reg-doc.service';
import { TelegramService } from "../../services/telegram.service";
import { HttpModule } from "@nestjs/axios";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [RegDocController],
  providers: [RegDocService, TelegramService],
  imports: [HttpModule, AuthModule]
})
export class RegDocModule {}
