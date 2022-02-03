import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiService} from "./api.service";
import {JwtAuthGuard} from "../jwt-auth-guard";

@UseGuards(JwtAuthGuard)
@Controller('api')
export class ApiController {

    constructor(
        readonly apiService: ApiService
    ) {
    }

    @Get('version')
    version(){
        return '1.0.0'
    }

}
