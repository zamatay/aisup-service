import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [ApiService],
  imports: [AuthModule],
  controllers: [ApiController]
})
export class ApiModule {}
