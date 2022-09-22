import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SambaService } from "./samba.service";
import { FileService } from './file.service';
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [SystemController],
  providers: [SystemService, SambaService, FileService],
  imports: [AuthModule],
  exports: [SystemService]
})
export class SystemModule {}
