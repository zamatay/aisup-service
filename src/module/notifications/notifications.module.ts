import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AuthModule } from "../auth/auth.module";
import { DataNotifyService } from './data/data-notify.service';
import { ScheduleModule } from "@nestjs/schedule";
import { NotifyGateway } from './notify.gateway';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, DataNotifyService, NotifyGateway],
  imports: [AuthModule, ScheduleModule.forRoot()]
})
export class NotificationsModule {}
