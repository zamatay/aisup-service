import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthModule } from "../auth/auth.module";
import { SystemModule } from "../system/system.module";

@Module({
  providers: [TaskService],
  controllers: [TaskController],
  imports: [AuthModule, SystemModule]
})
export class TaskModule {}
