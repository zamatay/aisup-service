import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiService} from "./api.service";
import {JwtAuthGuard} from "../../guards/jwt-auth-guard";
import { AppService } from "../app/app.service";

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

}
