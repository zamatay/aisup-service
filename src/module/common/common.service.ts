import { Injectable } from '@nestjs/common';
import { BaseService } from "../../services/base.service";

@Injectable()
export class CommonService extends BaseService{

    async getStaff(params: any) {
        const meta = {
            'id': { alias: "s.id" },
            'del': { alias: "s.del" },
            'family': { alias: "IsNull(LTRIM(RTRIM(s.Family))+' ','')" },
            'name': { alias: "IsNull(LTRIM(RTRIM(s.name))+' ','')" },
            'patronymic': { alias: "IsNull(LTRIM(RTRIM(s.patronymic))+' ','')" },
            'firm_id': {alias: 'OurFirm_id', type: 'number'},
            'post_id': {alias: "os.post_id"},
            'phone': {alias: 'PhoneContact', type: 'string'},
            'email': 'string',
            'PhoneHome': 'string',
            'PhoneWork': 'string',
            'PhoneWorkAdd': 'string',
            'DateEdit': {alias:"(select max(value) value from (values(s.dateEdit),(oph.DateEdit)) a(value))"},
            'DateCreate': {alias:"(select max(value) value from (values(s.DateCreate),(oph.DateCreate)) a(value))"}
        }

        const {fields, ...filter} = params;
        const query = this.manager.createQueryBuilder()
            .select(this.getSelectMeta(fields, meta))
            .from("ok_staff", 's')
            .leftJoin('OK_PostHistory', 'oph', 'oph.id = (SELECT TOP 1 id FROM dbo.OK_PostHistory WHERE s.id = Staff_Id AND del = 0 ORDER BY date DESC)')
            .leftJoin('OK_Shtat', 'os', 'os.id = oph.Shtat_ID')
            .where('s.del = 0 and s.ReleaseDate is null')
        this.addFilter(query, params, meta)
        console.log(query.getSql());
        return await query.execute();
    }
}
