export class BaseDto {
    static getItem(item){
        return null
    }

    protected static getInstance(){
        return new BaseDto()
    }

    static getItems(items){
        //console.log(items.map(item=>Object.assign(this.getInstance(), item)));
        return items.map(item=>this.getItem(item));
    }
}