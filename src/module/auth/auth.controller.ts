import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UserRegisterDto } from "../../dto/user-register-dto";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "../../dto/user-login-dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Авторизация')
@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @ApiProperty({description: "Процедура регистрации"})
    @Post('register')
    register(@Body() user: UserRegisterDto){
        return this.authService.register(user)
    }

    @ApiProperty({description: "Процедура авторизации"})
    @Post('login')
    login(@Body() user: UserLoginDto){
        return this.authService.login(user)
    }

    @ApiProperty({description: "Обновляет token и refreshToken"})
    @Post('refreshToken')
    refreshToken(@Body('refreshToken') refreshToken: string
    ){
        return this.authService.refreshToken(refreshToken)
    }

    @ApiProperty({description: "Обновляет token и refreshToken"})
    @Get('refreshToken')
    GetRefreshToken(@Query('refreshToken') refreshToken: string
    ){
        return this.authService.refreshToken(refreshToken)
    }
}
