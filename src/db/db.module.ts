import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
const dbOptions = require('../config/db').db;

@Module({
    imports: [
        TypeOrmModule.forRoot(dbOptions),
    ],
})
export class DbModule {}
