import { Injectable } from "@nestjs/common";
import { BaseService } from "../../services/base.service";
import { TelegramService } from "../../services/telegram.service";
import {
    IRegDocument,
    IRegDocumentCategory,
    IRegDocumentCategoryLink,
    IRegDocumentGroup,
    IRegDocumentType
} from "./dto/document-dto";

@Injectable()
export class RegDocService extends BaseService{

    constructor(props, private readonly telegramService: TelegramService) {
        super(props);
    }

    async getDocuments(params): Promise<IRegDocument[]> {
        const canFilter = {
            date: 'date',
            dateedit: 'date',
            code: 'string',
        }
        try {
            const query = this.manager.createQueryBuilder()
                .from('d_Documents', 'd')
                .innerJoin(qb => qb
                        .disableEscaping()
                        .select(['d1.id',  'f.[files]'])
                        .from("d_Documents d1 outer apply (select id as id, filename as fileName, description as description from _files where del = 0 and line_id = d1.id and table_id = 52701 for json PATH)", "f(files)")
                , 'd1', 'd1.id = d.id')
                .select(['d.id', 'd.code', 'd.date', 'd.documentgroup_id', 'd.documnettype_id as documenttype_id', 'd.staff_id', 'd.description', 'd1.files'])
                .where('del=0 and IsNull(IsNotConfirmed, 0) = 0 and IsNull(IsNull(IsNotConfirmed, 0), 0) = 0');
            // )
            if (params)
                this.addFilter(query, params, canFilter);
            const data = await query.execute();
            return await data;
        } catch (e) {
            this.telegramService.sendMessage(`Error on RegDocService getDocuments\r\n${e.message}`)
        }
    }

    async getGroups(): Promise<IRegDocumentGroup[]> {
        try {
            return await this.manager.createQueryBuilder()
                .from('d_DocumentGroups', 'd')
                .select(['id', 'parent_id', 'name'])
                .where('del=0')
                .execute()
        } catch (e) {
            this.telegramService.sendMessage(`Error on RegDocService getGroups\r\n${(e as Error).message}`)
        }
    }

    async getTypes(): Promise<IRegDocumentType[]> {
        try {
            return await this.manager.createQueryBuilder()
                .from('d_DocumentTypes', 't')
                .select(['id', 'name'])
                .where('del=0')
                .execute()
        } catch (e) {
            this.telegramService.sendMessage(`Error on RegDocService getTypes\r\n${(e as Error).message}`)
        }
    }

    async getCategories(): Promise<IRegDocumentCategory[]> {
        try {
            return await this.manager.createQueryBuilder()
                .from('d_DocumentCategories', 'c')
                .select(['id', 'name'])
                .where('del=0')
                .execute()
        } catch (e) {
            this.telegramService.sendMessage(`Error on RegDocService getCategories\r\n${(e as Error).message}`)
        }
    }

    async getCategoryLink(): Promise<IRegDocumentCategoryLink[]> {
        try {
            return await this.manager.createQueryBuilder()
                .from('d_DocumentCategoryLink', 'cl')
                .select(['id', 'document_id', 'category_id'])
                .where('del=0')
                .execute()
        } catch (e) {
            this.telegramService.sendMessage(`Error on RegDocService getCategoryLink\r\n${(e as Error).message}`)
        }
    }
}
