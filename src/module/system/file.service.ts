import { Injectable } from '@nestjs/common';
import { BaseService } from "../../services/base.service";

@Injectable()
export class FileService extends BaseService{
    async getFileNameByID(id: number[]): Promise<string[]>{
        const query = this.manager.createQueryBuilder()
            .from('_Files', 'f')
            .where('id in (:...id)', { id });
        const data = await query.execute();
        console.log(data);
        return data.map(i=>i.FileName);
    }
}
