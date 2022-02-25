import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import {AuthModule} from "../auth/auth.module";
import { AppService } from "../app/app.service";

@Module({
  providers: [ApiService, AppService],
  imports: [AuthModule],
  controllers: [ApiController]
})
export class ApiModule {}
