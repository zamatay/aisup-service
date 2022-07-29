import { ApiProperty } from "@nestjs/swagger";

export class IRegDocument {
    @ApiProperty({
        type: 'integer',
        description: "Идентификатор записи",
        example: 1
    })
    id: number;
    @ApiProperty({
        type: 'string',
        description: "Код документа",
        example: "ДИ-ИТ-1"
    })
    code: string;
    @ApiProperty({
        type: 'date',
        description: "Дата документа",
        example: '2017-04-27T21:00:00.000Z'
    })
    date: Date;
    @ApiProperty({
        type: 'integer',
        description: "Ссылка на группу документа",
        example: 5
    })
    documentGroup_ID: number;
    @ApiProperty({
        type: 'integer',
        description: "Ссылка на тип документа",
        example: 1
    })
    documentType_ID: number;
    @ApiProperty({
        type: 'integer',
        description: "Ссылка на персонал",
        example: 43
    })
    staff_ID: number;
    @ApiProperty({
        type: 'string',
        description: "Описание",
        example: 'Должностная инструкция руководителя департамента информационных технологий'
    })
    description: string;
}

export class IRegDocumentGroup {
    @ApiProperty({
        type: 'integer',
        description: "Идентификатор записи",
        example: 4
    })
    id: number;
    @ApiProperty({
        type: 'integer',
        description: "Ссылка на родительский документ",
        example: 2
    })
    parent_id: number;
    @ApiProperty({
        type: 'string',
        description: "Наименование",
        example: "Должностные инструкции"
    })
    name: string;
}

export class IRegDocumentType {
    @ApiProperty({
        type: 'integer',
        description: "Идентификатор записи",
        example: 1
    })
    id: number;
    @ApiProperty({
        type: 'string',
        description: "Наименование",
        example: "Инструкция"
    })
    name: string;
}

export class IRegDocumentCategory {
    @ApiProperty({
        type: 'integer',
        description: "Идентификатор записи",
        example: 2
    })
    id: number;
    @ApiProperty({
        type: 'integer',
        description: "Ссылка на родительскую категорию",
        example: 1
    })
    parent_id: number;
    @ApiProperty({
        type: 'string',
        description: "Наименование",
        example: "023_Модуль Судебные дела"
    })
    name: string;
}

export class IRegDocumentCategoryLink {
    @ApiProperty({
        type: 'integer',
        description: "Идентификатор записи",
        example: 64
    })
    id: number;
    @ApiProperty({
        type: 'integer',
        description: "Ссылка на документ",
        example: 30
    })
    document_id: number;
    @ApiProperty({
        type: 'integer',
        description: "Ссылка на категорию",
        example: 12
    })
    category_id: number;
}
