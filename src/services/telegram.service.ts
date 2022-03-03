import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { BaseService } from "./base.service";

@Injectable()
export class TelegramService extends BaseService{
  private key: string;
  private chat_id: string;


  constructor(props,
              private httpService: HttpService) {
    super(props)
    this.key = process.env.TELEGRAM_KEY;
    this.chat_id = process.env.TELEGRAM_CHAT_ID;
  }

  public sendMessage = (message: string): any =>{
    const url = `https://api.telegram.org/${this.key}/sendmessage?chat_id=${this.chat_id}&text=${message}`
    return this.httpService.get(encodeURI(url)).subscribe()
  };

}
