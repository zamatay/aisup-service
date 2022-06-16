import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";

@Injectable()
export class JwtAuthWsGuard implements CanActivate{

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        try {
            const client = context.switchToWs().getClient();
            return client.user;
        }catch (e){
            throw new UnauthorizedException();
        }
    }

}