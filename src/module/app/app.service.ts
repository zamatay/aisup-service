import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "../../services/base.service";

@Injectable()
export class AppService extends BaseService {

    getVersion(): string {
        return "1.0.0";
    }

    async getData(tableName:string, filter) {
        try {
            const selectIds = await this.getColumnNames(tableName);
            const select = selectIds.join(',').toLowerCase();
            if (selectIds.length){
                const query = this.manager.createQueryBuilder()
                    .select(select)
                    .from(tableName, 'a');
                this.prepareOffset(query, filter);
                if (selectIds.includes('del'))
                    query.where('del = 0')
                return query.execute();
            }
        } catch (e) {

        }
        throw new NotFoundException();
    }
}
