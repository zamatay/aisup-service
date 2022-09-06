import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UserRegisterDto } from "../../dto/user-register-dto";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "../../dto/user-login-dto";
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiTags } from "@nestjs/swagger";

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
    //@ApiBody({description:"{refreshToken: string}", examples: { "refreshToken": {summary:"refreshToken", value:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzI0MywibG9naW4iOiJaYW11cmFldl9hdiIsImlzQWRtaW4iOnRydWUsInN0YWZmX2lkIjozNSwiaWF0IjoxNjYxMzE5NTIyLCJleHAiOjE2NjEzMjA0MjJ9.sLkGzmucyX8WXD-P6Ir85agUm0guQlkFzw_ih8Iw7DA"} }})
    @ApiBody({schema: {example: {refreshToken: "string"}}})
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
