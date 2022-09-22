import { Module } from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import { UserService } from "../../services/user.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService],
    imports:[
        JwtModule.register({
        secret: process.env.SECRET ?? "SECRET",
        signOptions: {
            expiresIn: "15m"
        }})
    ],
    exports: [
        AuthService,
        JwtModule,
        UserService
    ]

})
export class AuthModule {

}
