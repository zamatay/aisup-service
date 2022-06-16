import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

@Injectable()
export class BaseService {

    constructor(
        @InjectEntityManager()
        public manager: EntityManager
    ) {

    }

    async query<T = any[]>(query: string, parameters: object = {}): Promise<T> {
        // example const res = await this.query("exec ImportRPFrom1C :data", {data: JSON.stringify(body)});
        const connection = this.manager.connection;
        const [ escapedQuery, escapedParams ] = connection.driver.escapeQueryWithParameters(query, parameters, {});
        return connection.query(escapedQuery, escapedParams);
    }

    queryBuilder(){
        return this.manager.createQueryBuilder();
    }

    returnOk(data = {}){
        return {statusCode: HttpStatus.OK, ...data}
    }

    returnBad(data = {}){
        return {statusCode: HttpStatus.BAD_GATEWAY, ...data}
    }

    addToLog(method: string, data: object): void{
        try {
            this.manager.createQueryBuilder()
              .insert()
              .into("_RequestHistory", ["Creator", "DateCreate", "Date", "post", "method"])
              .values([{
                  Creator: -1,
                  DateCreate: () => "GetDate()",
                  Date: () => "GetDate()",
                  post: JSON.stringify(data),
                  method
              }])
              .execute()
                .then()
                .catch();
        } catch (e) {
            //this.telegramService.sendMessage(e)
        }
    }

  async saveResponse(request, response): Promise<void>{
    await this.manager.createQueryBuilder()
      .insert()
      .into('s_post_log', ['request', 'response', 'date'])
      .values({request: JSON.stringify(request), response: JSON.stringify(response), date:()=>"GetDate()"})
      .execute()
  }

}
