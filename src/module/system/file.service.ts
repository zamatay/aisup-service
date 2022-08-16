import { Injectable } from '@nestjs/common';
import { BaseService } from "../../services/base.service";

@Injectable()
export class FileService extends BaseService{
    async getFileNameByID(id: number): Promise<string | null>{
        const data = await  this.manager.createQueryBuilder()
            .from('_Files', 'f')
            .where('id=:id', { id })
            .getRawOne();
        return data.FileName;
    }
}
