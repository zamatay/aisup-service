import { Module } from "@nestjs/common";
import { SendRoistatService } from "./send-roistat.service";
import { TelegramService } from "../../services/telegram.service";
import { HttpModule } from "@nestjs/axios";
import { SendRoistatController } from './send-roistat.controller';

@Module({
  providers: [SendRoistatService, TelegramService, HttpModule],
  imports: [HttpModule],
  controllers: [SendRoistatController]
})
export class SendRoistatModule {}