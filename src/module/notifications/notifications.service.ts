import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseService } from "../../services/base.service";
import { User } from "../../dto/User";
import { DataNotifyService } from "./data/data-notify.service";

@Injectable()
export class NotificationsService extends BaseService{

  constructor(props,
      protected dataService: DataNotifyService
  ) {
    super(props);
  }

  async getNotifications(user: User) {
    const staff_id = user.staff_id;
    const userNotify = await this.dataService.getUserNotify();

    const myNotify = userNotify.get(staff_id) ?? [];
    const allNotify = userNotify.get(0) ?? [];
    const ids = [...myNotify, ...allNotify];

    const result = []
    if (ids) {
      const notify = await this.dataService.getAllNotify();
      for (const id of ids) {
        const item = notify.get(id);
        if (!item.readers.includes(staff_id))
          result.push(item);
      }
    }

    return result;
  }

  async readNotify(staff_id: number, notify_id: number) {
    if (!staff_id || ! notify_id){
      throw new BadRequestException()
    }
    return await this.dataService.readNotify(staff_id, notify_id);
  }

  async getAllNotifications() {
    const n = await this.dataService.getAllNotify();
    return Object.fromEntries(n.entries());
  }
}
