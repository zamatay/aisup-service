import { Injectable } from "@nestjs/common";
import { BaseService } from "../../services/base.service";
import { Cron } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { TelegramService } from "../../services/telegram.service";
import { api } from "./api";

@Injectable()
export class GlonassService extends BaseService{
    private _CHUNK_DATA: number = 150;
    private headersRequest: AxiosRequestConfig;

    constructor(props, private readonly httpClient: HttpService, private readonly telegramService: TelegramService) {
        super(props);
    }

    getPromise(id): Promise<AxiosResponse> {
        return firstValueFrom<AxiosResponse>(this.httpClient.get(api.getObjectInfo(id), this.getHeaderRequest()));
    }

    async getPromiseData(promises){
        try {
            return await Promise.all(promises);
        } catch(e){
            return false
        }
    }

    getHeaderRequest(): AxiosRequestConfig{
        return {headers: {COOKIE: `SGUID=session_id=${api.sessionID}`}};
    }

    @Cron(`0 7 * * *`, {name: 'glonass'})
    async handleCron(): Promise<void>{
        try { // логинимся
            const data = await firstValueFrom(this.httpClient.get(api.login()));
            api.sessionID = data.headers.sessionid;
            // если залогинились и получили сессию
            if (api.sessionID) {
                // получаем список объектов
                const list = await firstValueFrom(this.httpClient.get(api.getObjects(), this.getHeaderRequest()));
                await this.query("exec m_ImportGlonasTransport :data", { data: JSON.stringify(list.data) });
                const ids = list.data.objects.map((item) => item.id);
                const allData = [];
                // пока список не пуст запрпашиваем данные по объекту
                while (ids.length) {
                    const rawIDs = ids.splice(0, this._CHUNK_DATA);
                    // формируем промисы
                    const promises = rawIDs.map(id => this.getPromise(id));
                    let exceptCount = 0;
                    let objectData;
                    // ждем пока все выполнится без ошибок но не более 5 раз
                    while (!(objectData = await this.getPromiseData(promises)) || exceptCount < 5) {
                        exceptCount++;
                    }
                    // собираем в объект
                    objectData.forEach(item => allData.push(item.data));
                }
                await this.query("exec m_ImportGlonasTransportDetail :data", { data: JSON.stringify(allData) });
                this.telegramService.sendMessage("Выгрузка Глонас завершена");
            }
        } catch (e) {
            this.telegramService.sendMessage(`Произошла ошибка во время выполнения импорта данных из Глонасс\r\n${e.message}`)
        }
    }}
