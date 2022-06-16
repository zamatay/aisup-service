import { Injectable } from "@nestjs/common";
import { INotifyItem, Notify } from "../../../dto/NotifyItem";
import { BaseService } from "../../../services/base.service";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { notifyEvent } from "../../../events/LoadNotifyEvent";

@Injectable()
export class DataNotifyService extends BaseService{
    private _notify: Notify;
    private lastDate: Date;
    private readonly periodSecond: number = 10;

    //@Cron('*/10 * * * * *', {name: "notify", })
    // подгружаем изменения раз в 10 секнд
    handleCron(){
        this._notify.beginLoad()
        this.loadNotify()
            .finally(()=> {
                this._notify.endLoad()
            });
    }

    constructor(
        props,
        private schedulerRegistry: SchedulerRegistry
    ) {
        super(props);
        this._notify = new Notify();
        this._notify.notify = new Map<number, INotifyItem>();
        this._notify.userNotify = new Map<number, [number]>();
        this.clearNotifications();
        this.addLoadNotifyCronJob('notify', this.periodSecond);
    }

    protected existsJob(name: string): boolean{
        return this.schedulerRegistry.doesExist('cron', name);
    }

    // создаем джоб который будет подгружать раз в 10 секунд изменения
    async addLoadNotifyCronJob(name: string, seconds: number) {
        if (this.existsJob(name)){
            return;
        }
        await this.loadNotify(true);
        const job = new CronJob(`*/${seconds} * * * * *`, ()=>this.handleCron());

        this.schedulerRegistry.addCronJob(name, job);
        job.start();
    }

    // раз в час перегружаем все. Необязательно, но так на всякий случай
    async addLoadAllNotifyCronJob(name: string, hour: number) {
        if (this.existsJob(name)){
            return;
        }
        this.clearNotifications();
        const job = new CronJob(`* * */${hour} * * *`, () => {
            this._notify.beginLoad()
            this.loadNotify().finally(()=> {
                this._notify.endLoad();
            });
        });

        this.schedulerRegistry.addCronJob(name, job);
        job.start();
    }

    // устанавливает текущую дату для последней загрузки и возвращает последнию загрузку
    protected getNewDate(): Date{
        const temp = this.lastDate;
        this.lastDate = new Date();
        return temp;
    }

    fillUserSet(item: INotifyItem){
        if (item.isAll){
            // под нулевой буду лежать для всех
            const value = this._notify.userNotify.get(0) ?? [];
            value.push(item.id);
            this._notify.userNotify.set(0, value);
        } else if (item.recipients) {
            // пробегаем по пользователям и устанавливаем в массив с пользователми id уведомления которое есть для него
            for (const user of item.recipients) {
                if (!item.readers.includes(user)){
                    const value = this._notify.userNotify.get(user) ?? [];
                    value.push(item.id);
                    this._notify.userNotify.set(user, value);
                }
            }
        }
    }

    // загружаем уведомления по дате установленной в lastDate
    async loadNotify(isAll: boolean = false): Promise<void> {
        const items = [];
        const rawItems = await this.manager.query(`
        DECLARE @lastDateTime DateTime = case when @0 = 1 then dateadd(m, -1, getDate()) else dateadd(s, -${this.periodSecond}, GETDATE()) end;
        with all_date as (
          select id, Date from _Notifycations where Date >= @lastDateTime
            union
          select Notification_id, Date from _NotifycationReaders where Date >= @lastDateTime
            union
          select Notification_id, Date from _NotifycationRecipients where Date >= @lastDateTime
        ),
        maxDate as (select id Notification_id, max(Date) dateedit from all_date group by id)
        SELECT n.id, n.text, n.object_id, n.isAll, stuff(r.staff_ids, 1, 1, '') readers, stuff(nr.Staff_ids, 1, 1, '') recipients, n.ids, getDate() currentDate, nt.color, n.date
        FROM _Notifycations n
           outer apply (select ',' + cast(staff_id as varchar) from _NotifycationRecipients nr where nr.Notification_id = n.id order by staff_id for xml path('')) nr(staff_ids)
           outer apply (select ',' + cast(staff_id as varchar) from _NotifycationReaders r where r.Notification_id = n.id order by staff_id for xml path('')) r(staff_ids)
        LEFT JOIN _NotifycationType nt ON nt.id = n.NotifycationType_id
           JOIN maxDate md on md.Notification_id = n.id and md.DateEdit >= @lastDateTime
        where (nr.staff_ids is not null or n.isAll = 1)
        order by 1,5,6
    `, [isAll]);
        for (const item of rawItems){
            // если все прочитали то пропускаем
            if (item.recipients === item.readers && !item.isAll){
                continue;
            }
            this._notify.notify.set(item.id, item);
            // парсим получателей и прочитавших
            item.recipients = item.recipients?.split(",").map(item=>+item) ?? [];
            item.readers = item.readers?.split(",").map(item=>+item) ?? [];

            items.push(item)

            this.fillUserSet(item);
        }
        if (!isAll){
            notifyEvent.emit('loadNotify', items)
        }
    }

    // массив всех уведомлений
    async getAllNotify(){
        if (!this._notify.notify.size){
            await this.loadNotify(true)
        }
        return this._notify.notify
    }

    // массив уведомлений по пользователям
    async getUserNotify(){
        if (!this._notify.userNotify.size){
            await this.loadNotify(true)
        }
        return this._notify.userNotify
    }

    // прочитать уведомление
    // записываем в базу что польщователь прочитал уведомление и устанавливаем в массив прочитавших
    async readNotify(staff_id: number, notify_id: number){
        try {
            const notify = this._notify.notify.get(notify_id);
            if (notify) {
                await this.queryBuilder().insert()
                    .into("_NotifycationReaders", ["notification_id", "staff_id", "date"])
                    .values({notification_id: notify_id, staff_id, date: new Date()})
                    .execute();
                notify.readers.push(staff_id);
                this._notify.notify.set(notify_id, notify);
            }
        } catch (e) {
            return this.returnBad();
        }
        return this.returnOk()
    }

    // очищаем все и инициализуруем переменные
    private clearNotifications() {
        this._notify.notify.clear();
        this._notify.userNotify.clear();
        this._notify.loaded = false;
        this._notify.isLoad = false;
        this.initLastDate()
    }

    private initLastDate() {
        this.lastDate = new Date();
        this.lastDate.setMonth(this.lastDate.getMonth() - 1);
    }
}
