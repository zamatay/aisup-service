import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({
            type: "string",
            description: "Наименование",
            example: "Ivanov"
        }
    )
    public name: string
}