import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DbModule} from "../db/db.module";
import {ConfigModule} from "@nestjs/config";
import {ApiModule} from "../api/api.module";
import {AuthModule} from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { SendMailModule } from "../send-mail/send-mail.module";
import { SendRoistatModule } from "../send-roistat/send-roistat.module";
import { UtilsModule } from "../utils/utils.module";
import { ImportModule } from "../import/import.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    ApiModule,
    DbModule,
    NotificationsModule,
    AuthModule,
    SendMailModule,
    SendRoistatModule,
    UtilsModule,
    ImportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
