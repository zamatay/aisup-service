class RoistatOldDto extends BaseDto{
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

module.exports = RoistatOldDto;