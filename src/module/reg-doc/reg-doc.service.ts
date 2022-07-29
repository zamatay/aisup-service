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
                .select(['id', 'code', 'date', 'documentgroup_id', 'documnettype_id as documenttype_id', 'staff_id', 'description'])
                .where('del=0 and IsNull(IsNotConfirmed, 0) = 0 and IsNull(IsNull(IsNotConfirmed, 0), 0) = 0');
            if (params)
                this.addFilter(query, params, canFilter);
            this.prepareOffset(query, params)
            return await query.execute();
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
