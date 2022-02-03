import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

const isolation = require('tedious').ISOLATION_LEVEL.READ_UNCOMMITTED;

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot({
            type: 'mssql',
            host: process.env.MSSQL_HOST,
            username: process.env.MSSQL_LOGIN,
            password: process.env.MSSQL_PASSWORD,
            database: process.env.MSSQL_DB,
            options: {
                encrypt: false,
                enableArithAbort: true,
                isolation: isolation,
                connectionIsolationLevel: isolation,
            },
            pool: {
                max: 20
            },
            autoLoadEntities: true,
        }),
    ],
})
export class DbModule {}
