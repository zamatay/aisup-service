import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserLoginDto} from "../../dto/user-login-dto";
import {UserRegisterDto} from "../../dto/user-register-dto";
import * as bcrypt from "bcryptjs"
import {BaseService} from "../../services/base.service";
import { UserService } from "../../services/user.service";

interface ITokenResult{
    token: string
    refreshToken: string
}

@Injectable()
export class AuthService extends BaseService{

    constructor(props,
                private jwtService: JwtService,
                private readonly userService: UserService
    ) {
        super(props);
    }

    setUserForSocket(socket: any, authHeader: string){
        if (!authHeader){
            socket.close(401)
            return;
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token){
            socket.close(401);
            return;
        }
        socket.user = this.jwtService.verify(token);
    }

    async login(user: UserLoginDto){
        const item = await this.userService.getUserByLogin(user.name)
        if (!item){
            throw new NotFoundException();
        }
        if (await AuthService.validateUser(item, user)){
            const {password, ...data} = item
            const tokens = await this.getTokens(data);
            return this.returnOk(tokens);
        } else {
            throw new UnauthorizedException()
        }
    }

    async register(user: UserRegisterDto) {
        const login = user.name
        // проверяем эквивалетность паролей
        if (user.password !== user.confirmPassword){
            throw new HttpException('password is not the same', HttpStatus.BAD_REQUEST)
        }
        // ищем пользователя
        const item = await this.userService.getUserByLogin(login);
        if (!item){
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }
        // извлекаем пароль
        const {password, ...data} = item;
        // генерим токены и сохраняем хеш пароля
        const tokens = await this.getTokens(data, user.password);

        return this.returnOk(tokens);
    }

    async refreshToken(refreshToken: string){
        if (!refreshToken){
            throw new NotFoundException('refreshToken can`t is empty');
        }
        // получаем пользователя из токена
        const user = this.jwtService.verify(refreshToken);
        // получаем из базы по токену и ид пользователя
        const item = await this.userService.getUserBy(
          [{"u.id": user.id}]
          )
        // если не нашли то возвращаем not found
        if (!item){
            throw new NotFoundException();
        }
        const {refreshToken: token, ...data} = item;
        // генерим токены
        const tokens = await this.getTokens(data);
        return this.returnOk(tokens);
        //
        // return this.returnOk({token: this.getToken(data)})
    }

    private static async hashPassword(password){
        return await bcrypt.hash(password, 6);
    }

    private getToken(payload){
        return this.jwtService.sign(payload);
    }

    private async getTokens(payload, password?: string): Promise<ITokenResult>{
        const refreshToken = await this.getRefreshToken(payload, password);
        return {token: this.getToken(payload), refreshToken};
    }

    private async getRefreshToken(payload, password?: string): Promise<string>{
        const refreshToken = this.jwtService.sign(payload, {expiresIn: '30d'});
        const hashPassword = (password) ? await AuthService.hashPassword(password) : null;
        await this.manager.query('exec s_RegisterUser @0, @1, @2',
          [payload.id,  hashPassword, refreshToken])
        return refreshToken
    }

    private async setUserRefreshToken(user_id: number, refreshToken: string): Promise<void>{
        await this.manager.query('exec s_InsertToken @0, @1', [user_id, refreshToken]);
    }

    private static async validateUser(item: any, user: UserLoginDto): Promise<boolean> {
        // console.log(user.password, item.password, await bcrypt.compare(user.password, item.password));
        return (item.password) && await bcrypt.compare(user.password, item.password);
    }
}
