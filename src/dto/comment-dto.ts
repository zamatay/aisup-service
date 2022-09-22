import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
    @ApiProperty({
        type: "integer",
        description: "Идентификатор комментария",
        example: 7270063
    })
    public id:        number;

    @ApiProperty({
        type: "integer",
        description: "Идентификатор объекта",
        example: 1127
    })
    public object_id: number;

    @ApiProperty({
        type: "integer",
        description: "Идентификатор строки в объекте",
        example: 186377
    })
    public line_id:   number;

    @ApiProperty({
        type: "string",
        description: "Комментарий",
        example: 'различие в общей площади 41.37, а необходимо 41.73'
    })
    public text:      string;

    @ApiProperty({
        type: "string",
        description: "ФИО",
        example: 'Куделина Анастасия Александровна'
    })
    public fio:       string;

    @ApiProperty({
        type: "date",
        description: "Идентификатор СУ",
        example: "2022-08-31T13:07:29.030Z"
    })
    public date:      Date;
}


export class AddCommentDto {
    @ApiProperty({
        required: true,
        type: "integer",
        description: "Идентификатор объекта",
        example: 1127
    })
    public object_id: number;

    @ApiProperty({
        required: true,
        type: "integer",
        description: "Идентификатор строки в объекте",
        example: 186377
    })
    public line_id:   number;

    @ApiProperty({
        required: true,
        type: "integer",
        description: "Идентификатор пользователя",
        example: 35
    })
    public user_id: number;

    @ApiProperty({
        required: true,
        type: "string",
        description: "Комментарий",
        example: 'Тестовый комментарий'
    })
    public text:      string;
}