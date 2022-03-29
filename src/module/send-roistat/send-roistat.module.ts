import { Module } from "@nestjs/common";
import { SendRoistatService } from "./send-roistat.service";
import { TelegramService } from "../../services/telegram.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  providers: [SendRoistatService, TelegramService, HttpModule],
  imports: [HttpModule]
})
export class SendRoistatModule {}