import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { BaseService } from "./base.service";
import { firstValueFrom } from "rxjs";
import { AxiosResponse } from "axios";

@Injectable()
export class TelegramService extends BaseService{
  private readonly key: string;
  private readonly chat_id: string;


  constructor(props,
              private httpService: HttpService) {
    super(props)
    this.key = process.env.TELEGRAM_KEY;
    this.chat_id = process.env.TELEGRAM_CHAT_ID;
  }

  public sendMessage = async (message: string): Promise<any> =>{
    try {
      const url = `https://api.telegram.org/${this.key}/sendmessage?chat_id=${this.chat_id}&text=${message}`
      return await firstValueFrom<AxiosResponse>(this.httpService.get(encodeURI(url)));
    } catch (e) {
      console.log('Ошибка во время выполнения отправки сообщения в телеграм \r\n' + e);
    }
  };

}
