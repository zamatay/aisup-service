import { ApiProperty } from "@nestjs/swagger";

export class IdNameDto {
    @ApiProperty({
            type: "int",
            description: "Идентификатор",
            example: 1
        }
    )
    public id: number
    @ApiProperty({
            type: "string",
            description: "Наименование",
            example: "Наименование"
        }
    )
    public name: number
}