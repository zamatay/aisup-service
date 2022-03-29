import { HttpException, UnauthorizedException } from "@nestjs/common";
import { METHOD_GET } from "./roistat-interface";
import { firstValueFrom } from "rxjs";
import { AxiosResponse} from 'axios'

export class Api {
  API_URL = 'https://cloud.roistat.com/api/v1/';

  constructor(protected _api_key: string, protected _project_id: string, protected sendFunction) {}

  send = async (apiMethod, post = {}) => {
    const method = apiMethod.type ?? METHOD_GET;
    const url = this.buildUrl(apiMethod);
    const response = await firstValueFrom<AxiosResponse>(this.sendFunction(method, url, post));
    //console.log(response.headers);
    const data = response.data;
    if (data["error"]) {
      if (data["error"] === "authentication_failed") {
        throw new UnauthorizedException(data["error"]);
      }
      throw new HttpException(data["error"], 500);
    }
    return data;
  }

  buildUrl = (apiMethod) => {
    return `${this.API_URL}${apiMethod.name}?project=${this._project_id}&key=${this._api_key}`;
  }
}