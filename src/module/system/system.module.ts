import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SambaService } from "./samba.service";
import { FileService } from './file.service';

@Module({
  controllers: [SystemController],
  providers: [SystemService, SambaService, FileService]
})
export class SystemModule {}
