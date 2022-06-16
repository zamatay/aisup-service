import { User } from "../dto/User";

export interface AuthSocket extends WebSocket{
    user: User
}
