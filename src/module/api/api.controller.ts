import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {ApiService} from "./api.service";
import {JwtAuthGuard} from "../../guards/jwt-auth-guard";
import { AppService } from "../app/app.service";
import { ApiOperation, ApiParam } from "@nestjs/swagger";

@UseGuards(JwtAuthGuard)
@Controller('api')
export class ApiController {

    constructor(
        readonly apiService: ApiService,
        readonly appService: AppService
    ) {
    }

    @Get('version')
    version(){
        return this.appService.getVersion()
    }

    @Get('dbName')
    async getDBName() {
        return await this.appService.getDBName()
    }

    @ApiOperation({summary: "Процедура получения данных из таблицы"})
    @ApiParam({ name: "tableName", required: true, description: "Название таблицы в системе" })
    @Get('getData')
    getData(@Query() query){
        const {tableName, ...filter} = query
        return this.appService.getData(tableName, filter)
    }

}
