import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {UserRegisterDto} from "../dto/user-register-dto";
import {AuthService} from "./auth.service";
import {UserLoginDto} from "../dto/user-login-dto";
import {JwtAuthGuard} from "../jwt-auth-guard";

@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('register')
    register(@Body() user: UserRegisterDto){
        return this.authService.register(user)
    }

    @Post('login')
    login(@Body() user: UserLoginDto){
        return this.authService.login(user)
    }

    @UseGuards(JwtAuthGuard)
    @Post('refreshToken')
    refreshToken(@Body() user: UserLoginDto){
        return this.authService.refreshToken(user)
    }
}
