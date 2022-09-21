import { ApiProperty } from "@nestjs/swagger";

export class IQueston {
    @ApiProperty({
        type: 'integer',
        description: "Идентификатор записи",
        example: 44
    })
    id: number;

    @ApiProperty({
        type: 'string',
        description: "Вопрос",
        example: "С кем в обязательном порядке согласовывается задание на проектирование?"
    })
    name: string;

    @ApiProperty({
        type: 'string',
        description: "номер",
        example: null
    })
    number: Date;

    @ApiProperty({
        type: 'integer',
        description: "Ссылка на тест",
        example: 5
    })
    test_ID: number;

    @ApiProperty({
        type: 'boolean',
        description: "Ответы горизонтально",
    })
    AnswerIsHorizontal: boolean;

    @ApiProperty({
        type: 'boolean',
        description: "Имеют ли вопросы картинки",
        example: 1
    })
    has_image: boolean;

}

export class IAnswer {
    @ApiProperty({
        type: 'integer',
        description: "Идентификатор записи",
        example: 44
    })
    id: number;
}