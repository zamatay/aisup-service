export interface INotifyItem{
    id: number,
    text: string,
    date: Date,
    recipients: number[],
    readers: number[],
    isAll: boolean,
    object_id: number,
    ids: string,
    color: number
}

export class Notify {
    isLoad: boolean
    loaded: boolean
    notify: Map<number, INotifyItem>
    userNotify: Map<number, number[]>

    beginLoad(){
        this.loaded = true;
    }

    endLoad(){
        this.loaded = false;
        this.isLoad = true;
    }
}