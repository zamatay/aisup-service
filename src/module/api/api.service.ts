import {Injectable} from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";

@Injectable()
export class ApiService {

    constructor(
        @InjectEntityManager()
        private manager: EntityManager
    ) {
    }

}
