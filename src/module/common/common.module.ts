import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
  providers: [CommonService],
  controllers: [CommonController],
  imports: [AuthModule],
})
export class CommonModule {}