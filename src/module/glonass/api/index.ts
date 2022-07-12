const userName = '%D0%92%D0%9A%D0%91'
const password = '%D0%A2%D1%83%D0%BB%D0%B03'

class Api{
    private readonly _userName;
    private readonly _password;
    private nowDate: string = new Date().toISOString().split('T')[0];
    public sessionID: string;

    constructor(userName: string, password: string) {
        this._userName = userName;
        this._password = password;
    }

    login(){
        return `http://vkb.glonass.io/api/integration/v1/connect?login=${this._userName}&password=${this._password}&lang=ru-ru&timezone=0`;
    }

    getObjects(){
        return `http://vkb.glonass.io/api/integration/v1/getobjectslist?companyId=0`;
    }

    getObjectInfo(id){
        return `http://vkb.glonass.io/api/integration/v1/objectinfo?oid=${id}&dt=${this.nowDate}`;
    }
}

export const api = new Api(userName, password);