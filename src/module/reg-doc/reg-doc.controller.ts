import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { RegDocService } from "./reg-doc.service";
import {
    IRegDocument,
    IRegDocumentCategory,
    IRegDocumentCategoryLink,
    IRegDocumentGroup,
    IRegDocumentType
} from "./dto/document-dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt-auth-guard";

@UseGuards(JwtAuthGuard)
@ApiTags('Регламентные документы')
@Controller('api/reg-doc')
export class RegDocController {

    constructor(private readonly docService: RegDocService) {
    }

    @ApiOperation({ summary: 'Получение всех регламентыных документов' })
    @ApiResponse({ status: 200, description: 'Возвращает все документы', type: IRegDocument, isArray: true})
    @Get('documents')
    async documents(@Query() params): Promise<IRegDocument[]>{
        return await this.docService.getDocuments(params);
    }

    @ApiOperation({ summary: 'Получение всех групп регламентыных документов' })
    @ApiResponse({ status: 200, description: 'Возвращает группы регламентных документов', type: IRegDocumentGroup, isArray: true})
    @Get('groups')
    async groups(): Promise<IRegDocumentGroup[]>{
        return await this.docService.getGroups();
    }

    @ApiOperation({ summary: 'Получение всех типов регламентыных документов' })
    @ApiResponse({ status: 200, description: 'Возвращает типы регламентных документов', type: IRegDocumentType, isArray: true})
    @Get('types')
    async types(): Promise<IRegDocumentType[]>{
        return await this.docService.getTypes();
    }

    @ApiOperation({ summary: 'Получение всех категорий регламентыных документов' })
    @ApiResponse({ status: 200, description: 'Возвращает категории регламентных документов', type: IRegDocumentCategory, isArray: true})
    @Get('categories')
    async categories(): Promise<IRegDocumentCategory[]>{
        return await this.docService.getCategories();
    }

    @ApiOperation({ summary: 'Получение всех связей регламентных документов и категорий' })
    @ApiResponse({ status: 200, description: 'Возвращает связи категорий и регламентных документов', type: IRegDocumentCategory, isArray: true})
    @Get('categoryLink')
    async categoryLink(): Promise<IRegDocumentCategoryLink[]>{
        return await this.docService.getCategoryLink();
    }
}
