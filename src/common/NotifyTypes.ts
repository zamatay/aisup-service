export enum NotifyNames {
    newNotify="newNotify"
}
export interface NotifyTypes{
    event: NotifyNames,
    data: object
}