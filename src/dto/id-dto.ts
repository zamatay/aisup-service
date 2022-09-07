import { ApiProperty } from "@nestjs/swagger";

export class IdDto {
    @ApiProperty({
            type: "int",
            description: "Идентификатор",
            example: 1
        }
    )
    public id: number
}