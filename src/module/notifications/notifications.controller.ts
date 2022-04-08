                                            import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../jwt-auth-guard";
import { NotificationsService } from "./notifications.service";

@UseGuards(JwtAuthGuard)
@Controller('api/notify')
export class NotificationsController {

  constructor(readonly ns: NotificationsService) {
  }

  @Get('getNotifications')
  async getNotifications(@Req() req): Promise<any> {
    return await this.ns.getNotifications(req.user);
  }

  @Get('getAllNotifications')
  async getAllNotifications(): Promise<any> {
    return await this.ns.getAllNotifications();
  }

  @Post('readNotify')
  async readNotify(@Body("staff_id") staff_id: number,
                   @Body('notify_id') notify_id: number){
    return await this.ns.readNotify(staff_id, notify_id)
  }
}
