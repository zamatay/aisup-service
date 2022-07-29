import { Injectable } from "@nestjs/common";
import { BaseService } from "../../services/base.service";
import { Methods, Roistat } from "./roistat";
import { roistat } from "../../config/roistat";
import { TelegramService } from "../../services/telegram.service";
import { Cron } from "@nestjs/schedule";
import { RoistatNewDto, RoistatOldDto } from "./roistat/dto/roistat-dto";
import { HttpService } from "@nestjs/axios";
import { METHOD_POST } from "./roistat/roistat-interface";
import { Method } from "axios/lib/axios";
import { AxiosRequestConfig } from "axios";

interface IRawDataItem {
    clientStatus_id: number,
    roistat_id: string,
    date_Last: Date,
    client_id: number,
    date_create: Date,
    name: string,
    id: number,
    date: Date
}

@Injectable()
export class SendRoistatService extends BaseService {
    private guid: string = "1DAF8E06-0ACF-43EF-BA33-5F71F961A788";
    private project_old_data: Roistat;
    private project_new_data: Roistat;

    sendFunction = (method: Method, url: string, postData: object) => {
        const requestConfig: AxiosRequestConfig = {
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        };
        try {
            return (method === METHOD_POST) ? this.httpClient.post(url, postData, requestConfig) : this.httpClient.get(url, requestConfig);
        } catch (e) {
            this.telegramService.sendMessage(`Error on sendFunction roistat\r\n${e.message}`);
        }
    };

    constructor(props, protected telegramService: TelegramService, public readonly httpClient: HttpService) {
        super(props);
        this.project_old_data = new Roistat(roistat.ROISTAT_KEY, roistat.PROJECT_ID_OLD, this.sendFunction);
        this.project_new_data = new Roistat(roistat.ROISTAT_KEY, roistat.PROJECT_ID, this.sendFunction);
    }

    async getLastDate(): Promise<Date> {
        const rawDate = await this.queryBuilder().from("_GlobalOptions", "go").where("guid=:guid", { guid: this.guid }).getRawOne();
        return (rawDate && rawDate.dt) ? new Date(rawDate.dt) : new Date(0);
    }

    async setLastDate(date): Promise<void> {
        let data = await this.queryBuilder()
            .update("_GlobalOptions")
            .set({ dt: date })
            .where("guid = :guid", { guid: this.guid })
            .execute();
        if (data.affected === 0) {
            await this.queryBuilder().insert()
                .into("_GlobalOptions", ["guid", "dt"])
                .values({ guid: this.guid, dt: date })
                .execute();
        }
    }

    async getData(): Promise<IRawDataItem[]> {
        try {
            return await this.query(`
                        declare @date DATETIME = :date;
                        select  
                            pc.clientStatus_id,
                            roistat_id,
                            format(rhd_last.DateCreate, 'dd-MM-yyyy HH:mm') date_Last,
                            pc.id client_id,
                            format(pc.DateCreate, 'dd-MM-yyyy HH:mm') date_create,
                            isnull(s.Family + ' ', '') + isnull(s.Name + ' ', '') + isnull(s.Patronymic, '') name,
                            rhd_last.id, 
                            contracts.date
                        from r_PotentialClients pc
                            left JOIN (
                                select top 1 with ties  DateCreate, CalcRoistat_id roistat_id, PotentialClient_id, id
                                from _RequestHistoryDetail
                                where roistat_id is not null
                                order by ROW_NUMBER() over (partition by PotentialClient_id order by DateCreate desc)
                            ) rhd_last on rhd_last.PotentialClient_id = pc.id
                            outer apply (SELECT top 1 format(dateMake, 'dd-MM-yyyy HH:mm') date from x_contracts where del = 0 and contractStatus_id = 2 and contractType_id in (SELECT id from x_contractTypes where parent_id = 35) and PotentialClient_id = pc.id order by datemake desc) contracts
                            left join OK_Staff s on s.id = isnull(pc.ToManager_id, pc.staff_id)
                        where pc.del = 0
                          and (DateStatusChange >= @date or rhd_last.DateCreate >= @date)
                          and rhd_last.roistat_id is not null
                          and pc.ClientStatus_id is not null`
                , { date: await this.getLastDate() }
            );
        } catch (e) {
            this.telegramService.sendMessage(`Error on getData roistat\r\n${e.message}`);
            return [];
        }
    }

    @Cron(`*/${roistat.INTERVAL} * 5-23 * * *`, { name: "roistat" })
    async handleCron(): Promise<void> {
        try {
            const date = new Date();
            const rawData = await this.getData();
            if (rawData.length) {
                let response, data;

                data = RoistatOldDto.getItems(rawData);
                response = await this.project_old_data.api().send(Methods.ADD_ORDERS, data);
                await this.saveResponse(data, response);

                data = RoistatNewDto.getItems(rawData);
                response = await this.project_new_data.api().send(Methods.ADD_ORDERS, data);
                await this.saveResponse(data, response);

            }
            await this.setLastDate(date);
        } catch (e) {
            this.telegramService.sendMessage(`Error on Cron roistat\r\n${e.message}`);
        }
    }

}
