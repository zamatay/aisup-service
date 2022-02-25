import { Inject } from "@nestjs/common";
import { HttpService } from "@nestjs/axios"
import { map } from "rxjs";
//const axios = require("../http");
const AuthException = require('./exception/AuthException')

type MethodType = 'POST' | 'GET';

export class Api {
  API_URL = 'https://cloud.roistat.com/api/v1/';
  METHOD_POST: MethodType = 'POST';
  METHOD_GET: MethodType  = 'GET';

  @Inject('HTTP_OPTIONS')
  private readonly httpClient: HttpService;

  constructor(protected _api_key: string, protected _project_id: string) {}

  send = async (apiMethod, post = {}) => {
    const method = apiMethod.type || this.METHOD_GET;
    const url = this.buildUrl(apiMethod);
    const response = (method === this.METHOD_POST) ? this.httpClient.post(url, post) : this.httpClient.get(url);

    const data = response.pipe(map((data)=>{
      return data.data;
    }));
    if (data['error']) {
      if (data['error'] === 'authentication_failed') {
        throw new AuthException(data['error']);
      }
      throw new Error(data['error']);
    }
    return data;
  }

  buildUrl = (apiMethod) => {
    return `${this.API_URL}${apiMethod.name}?project=${this._project_id}&key=${this._api_key}`;
  }
}