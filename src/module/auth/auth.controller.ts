import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UserRegisterDto } from "../../dto/user-register-dto";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "../../dto/user-login-dto";
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Авторизация')
@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: "Процедура регистрации"})
    @Post('register')
    register(@Body() user: UserRegisterDto){
        return this.authService.register(user)
    }

    @ApiOperation({summary: "Процедура авторизации"})
    @Post('login')
    login(@Body() user: UserLoginDto){
        return this.authService.login(user)
    }

    @ApiOperation({summary: "Обновляет token и refreshToken"})
    @Post('refreshToken')
    refreshToken(@Body('refreshToken') refreshToken: string
    ){
        return this.authService.refreshToken(refreshToken)
    }

    @ApiOperation({summary: "Обновляет token и refreshToken"})
    @Get('refreshToken')
    GetRefreshToken(@Query('refreshToken') refreshToken: string
    ){
        return this.authService.refreshToken(refreshToken)
    }

    @Get('getTokenService')
    @ApiExcludeEndpoint()
    private GetToken(){
        return this.authService.tokenService()
    }
}
