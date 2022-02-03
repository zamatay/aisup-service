import { Module } from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports:[
        JwtModule.register({
        secret: process.env.SECRET ?? "SECRET",
        signOptions: {
            expiresIn: "1h"
        }})
    ],
    exports: [
        AuthService,
        JwtModule
    ]

})
export class AuthModule {

}
