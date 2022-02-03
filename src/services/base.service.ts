import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";

@Injectable()
export class BaseService {

    constructor(
        @InjectEntityManager()
        public manager: EntityManager,
    ) {

    }

    queryBuilder(){
        return this.manager.createQueryBuilder();
    }

    returnOk(data){
        return {statusCode: HttpStatus.OK, ...data}
    }

}
