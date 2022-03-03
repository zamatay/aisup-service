import { BaseDto } from "../../../../dto/base-dto";

export class RoistatOldDto extends BaseDto{

    protected static getInstance(){
        return new RoistatOldDto()
    }

    static getItem(item){
        const {
            roistat_id: roistat,
            clientStatus_id: status,
            date_Last: date_create,
            client_id: id,
            date_create: first_order_date,
            name: manager,
            date
        } = item;
        return {
            roistat,
            status: status.toString(),
            date_create,
            id: id.toString(),
            price: null,
            name: "Заявка",
            fields: {first_order_date, manager, sell_date: date}
        }
    }
}

export class RoistatNewDto extends BaseDto{

    protected static getInstance(){
        return new RoistatNewDto()
    }

    static getItem(item){
        const {
            roistat_id: roistat,
            clientStatus_id: status,
            date_Last: date_create,
            client_id,
            date_create: first_order_date,
            name: manager,
            id,
            date
        } = item;
        return {
            roistat,
            status: status.toString(),
            date_create,
            client_id: client_id.toString(),
            id: id.toString(),
            price: null,
            name: "Заявка",
            fields: {first_order_date, manager, sell_date: date}
        }
    }
}