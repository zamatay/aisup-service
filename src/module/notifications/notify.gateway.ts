import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { UseGuards } from "@nestjs/common";
import { JwtAuthWsGuard } from "../../guards/jwt-auth-ws-guard";
import { AuthService } from "../auth/auth.service";
import { AuthSocket } from "../../interfaces/AuthSocket";
import { NotificationsService } from "./notifications.service";
import { notifyEvent } from "../../events/LoadNotifyEvent";
import { INotifyItem } from "../../dto/NotifyItem";
import { NotifyNames } from "../../common/NotifyTypes";

export interface NotifyGatewayPayload{
    method: 'get' | 'getAll' | 'readNotify',
    data: object
}

// @WebSocketGateway({path: '/notify'})
@UseGuards(JwtAuthWsGuard)
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotifyGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: any;



    constructor(private authService: AuthService,
                private notifyService: NotificationsService) {
        notifyEvent.on("loadNotify", this.sendNotifyMessage);
    }

    @SubscribeMessage("notify")
    notifyHandler (client: AuthSocket, payload: NotifyGatewayPayload): Promise<any>{
        switch (payload.method){
            case "get": return this.getNotify(client, payload.data)
            case "getAll": return this.getAllNotify(client, payload.data)
            case "readNotify": return this.readNotify(client, payload.data)
        }
    }

    async getNotify(client: AuthSocket, payload: any): Promise<object> {
        const data = await this.notifyService.getNotifications(client.user);
        return { method: "get", data };
    }

    async getAllNotify(client: AuthSocket, payload: any): Promise<any> {
        const data = await this.notifyService.getAllNotifications();
        return { method: "getAll", data };
    }

    async readNotify(client: AuthSocket, payload: any): Promise<any> {
        const staff_id = client.user.staff_id;
        const incomingData = JSON.parse(payload);
        const data = await this.notifyService.readNotify(staff_id, incomingData.id);
        return { method: "readNotify", data };
    }

    getSocketByStaffID = (staff_id: number): WebSocket | null => {
        for (const socket of this.server.clients){
            if (socket.user.staff_id === staff_id){
                return socket;
            }
        }
        return null;
    }

    sendNotifyMessage = (notifyItems: INotifyItem[]) => {
        for (const item of notifyItems) {
            for (const staff of item.recipients){
                if (!item.readers?.includes(staff)) {
                    const socket = this.getSocketByStaffID(staff);
                    if (socket){
                        socket.send(JSON.stringify({ event: NotifyNames.newNotify, data: item }))
                    }
                }
            };
        };

    }

    async handleConnection(client: any, ...args: any[]): Promise<any> {
        const authHeader = args[0].headers.authorization;
        this.authService.setUserForSocket(client, authHeader);
        const notifyties = await this.notifyService.getNotifications(client.user);
        if (notifyties) {
            console.log(notifyties);
            client.send(JSON.stringify({ event: NotifyNames.newNotify, data: notifyties }))
        }
        console.log(`connection ${client.user.login}`);
    }

    handleDisconnect(client: AuthSocket): any {
        console.log(`disconnect ${client.user.login}`);
    }

}
