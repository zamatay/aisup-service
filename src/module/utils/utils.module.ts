import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
  imports: [AuthModule]
})
export class UtilsModule {}
