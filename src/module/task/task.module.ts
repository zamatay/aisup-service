import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
  providers: [TaskService],
  controllers: [TaskController],
  imports: [AuthModule]
})
export class TaskModule {}
