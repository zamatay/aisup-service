import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserLoginDto} from "../dto/user-login-dto";
import {UserRegisterDto} from "../dto/user-register-dto";
import * as bcrypt from "bcryptjs"
import {BaseService} from "../services/base.service";

interface ITokenResult{
    token: string
    refreshToken: string
}

@Injectable()
export class AuthService extends BaseService{

    constructor(props,
                private jwtService: JwtService
    ) {
        super(props);
    }

    async login(user: UserLoginDto){
        const item = await this.getUserByLogin(user.name)
        if (await AuthService.validateUser(item, user)){
            const {password, ...data} = item
            return this.returnOk({token: this.getToken({...data})});
        } else {
            throw new UnauthorizedException()
        }
    }

    async register(user: UserRegisterDto) {
        const login = user.name
        if (user.password !== user.confirmPassword){
            throw new HttpException('password is not the same', HttpStatus.BAD_REQUEST)
        }
        const item = await this.getUserByLogin(login);
        if (!item){
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }
        const {password, ...data} = item;
        const tokens = await this.getTokens(data);

        await this.manager.query('exec s_RegisterUser @0, @1, @2', [item.id,  await AuthService.hashPassword(user.password), tokens.refreshToken])
        return this.returnOk(tokens);
    }

    async refreshToken(user: UserLoginDto){

    }

    private static async hashPassword(password){
        return await bcrypt.hash(password, 6);
    }

    private getToken(payload){
        return this.jwtService.sign(payload);
    }

    private async getTokens(payload): Promise<ITokenResult>{
        const refreshToken = await this.getRefreshToken(payload);
        return {token: this.getToken(payload), refreshToken};
    }

    private async getRefreshToken(payload): Promise<string>{
        return this.jwtService.sign(payload, {expiresIn: '30d'});
    }

    private async setUserRefreshToken(user_id: number, refreshToken: string): Promise<void>{
        await this.manager.query('exec s_InsertToken @0, @1', [user_id, refreshToken]);
    }

    private async getUserByLogin(login: string) {
        return await this.queryBuilder()
            .select(['u.id', 'u.login', 'u.isAdmin', 'u.staff_id', 't.password'])
            .from('_users', 'u')
            .leftJoin('s_token', 't', 't.user_id = u.id')
            .where('u.del = 0 and u.IsLocked = 0 and u.login = :login', {login})
            .getRawOne();
    }


    private static async validateUser(item: any, user: UserLoginDto): Promise<boolean> {
        return await bcrypt.compare(user.password, item.password);
    }
}
