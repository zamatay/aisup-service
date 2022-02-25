import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AuthModule } from "../auth/auth.module";
import { DataNotifyService } from './data/data-notify.service';
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, DataNotifyService],
  imports: [AuthModule, ScheduleModule.forRoot()]
})
export class NotificationsModule {}
