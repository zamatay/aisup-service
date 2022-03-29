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

    queryBuilder(){
        return this.manager.createQueryBuilder();
    }

    returnOk(data = {}){
        return {statusCode: HttpStatus.OK, ...data}
    }

    returnBad(data = {}){
        return {statusCode: HttpStatus.BAD_GATEWAY, ...data}
    }

    async addToLog(method: string, data: object): Promise<void>{
        try {
            await this.manager.createQueryBuilder()
              .insert()
              .into("_RequestHistory", ["Creator", "DateCreate", "Date", "post", "method"])
              .values([{
                  Creator: -1,
                  DateCreate: () => "GetDate()",
                  Date: () => "GetDate()",
                  post: JSON.stringify(data),
                  method
              }])
              .execute();
        } catch (e) {
            //this.telegramService.sendMessage(e)
        }
    }

}
