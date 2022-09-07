import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, SelectQueryBuilder } from "typeorm";

@Injectable()
export class BaseService {
    defaultReturn: ['*'];

    constructor(
        @InjectEntityManager()
        public readonly manager: EntityManager
    ) {

    }

    async getColumnNames(tableName, exclude: string[] = ['guid', 'Editor', 'Creator', 'DateEdit', 'DateCreate']): Promise<string[]>{
        try {
            const query = this.manager.createQueryBuilder().select("COLUMN_NAME").from('INFORMATION_SCHEMA.COLUMNS', 'c').where('TABLE_NAME = :tableName and COLUMN_NAME not IN (:...ids)', {tableName, ids: exclude});
            const data =  await query.execute();
            return data.map(item=>item.COLUMN_NAME)
        }catch(e){

        }
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

    parseFilterValue(value: string){
        let condition = '=';
        const data = value.match(/^(>=|<=|<|>|=)(.+)/);
        if (data)
            [, condition, value] = data;
        return [value, condition]
    }

    getSelect(select){
        try {
            const selects = [];
            for (const name in select) {
                if (typeof select[name] === "string") {
                    selects.push(name);
                } else {
                    selects.push(`${select[name].alias} as ${name}`);
                }
            }
            return selects;
        } catch (e) {
            return this.defaultReturn;
        }
    }

    getSelectMeta(select, meta){
        try {
            if (select === '*' ){
                return this.defaultReturn;
            }
            if (!select){
                select = Object.keys(meta);
            }
            const selects = []
            for (const name in select){
                // если нашли в метаинформации берем оттуда
                if (meta.hasOwnProperty(select[name]) && typeof meta[select[name]] === 'object') {
                    selects.push(`${meta[select[name]].alias} as ${select[name]}`);
                // если значение в массиве не именнованное то берем просто название
                } else if(Number.isInteger(Number(name))) {
                    selects.push(`${select[name]}`);
                // а так берем название как значение
                } else {
                    selects.push(`${name} as ${select[name]}`);
                }
            }
            return selects;
        } catch (e){
            return this.defaultReturn;
        }
    }
    addFilter(query: SelectQueryBuilder<any>, data, filterObject: Object) {
        if (!query.expressionMap.wheres.length)
            query.where('del=0');
        for (const paramName in data){
            if (filterObject[paramName.toLowerCase()]){
                let value=data[paramName];
                let [rawValue, condition] = this.parseFilterValue(value);
                if (filterObject[paramName.toLowerCase()] === 'date'){
                    value = new Date(rawValue);
                }
                query.andWhere(`${paramName}${condition}:${paramName}`, {[paramName]: rawValue});
            }
        }
        this.prepareOffset(query, data);
        this.addOrder(query, data);
    }

    prepareOffset(query: SelectQueryBuilder<any>, filter){
        const {limit, offset} = filter;
        query.limit(limit ?? 10000);
        query.offset(offset ?? 0);
    }

    private addOrder(query: SelectQueryBuilder<any>, filter) {
        const {order} = filter;
        if (order) {
            const orders = order.split(" ");
            while (orders.length) {
                const column = orders.shift();
                let ord = "ASC";
                if (orders[0] && (orders[0].toLowerCase() === "asc" || orders[0].toLowerCase() === "desc")) {
                    ord = orders.shift().toUpperCase();
                }
                query.addOrderBy(column, ord as "ASC" | "DESC");
            }
        }
    }
}
