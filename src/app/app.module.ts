import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DbModule} from "../db/db.module";
import {ConfigModule} from "@nestjs/config";
import {ApiModule} from "../api/api.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`,
        isGlobal: true,
      }),
      ApiModule,
      DbModule,
      AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
