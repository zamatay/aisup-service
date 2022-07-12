import { Module } from "@nestjs/common";
import { GlonassService } from "./glonass.service";
import { TelegramService } from "../../services/telegram.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    providers: [GlonassService, TelegramService, HttpModule],
    imports: [HttpModule]
})

export class GlonassModule{}
