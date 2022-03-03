import { Api } from "./Api";

export class Methods {
  public static readonly  ADD_ORDERS = { name: "project/add-orders", type: "POST"}
  public static readonly SET_STATUSES =   { name: "project/set-statuses", type: "POST"}
}

export class Roistat {
  protected _api_key: string;
  protected _project_id: string;
  protected _api: Api;

  constructor(api_key: string, project_id: string, sendFunction) {
    this._api_key = api_key;
    this._project_id = project_id;
    this._api = new Api(this._api_key, this._project_id, sendFunction);
  }

  api(){
    return this._api;
  }
}