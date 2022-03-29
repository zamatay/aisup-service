import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';
import { ConfigModule } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { TelegramService } from "../../services/telegram.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  providers: [SendMailService, TelegramService],
  imports: [
    HttpModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <aisup@v-k-b.ru>',
      }
    }),

  ]
})
export class SendMailModule {}
