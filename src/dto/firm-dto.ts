import { ApiProperty } from "@nestjs/swagger";

export class FirmDto {
  @ApiProperty({
    readOnly: true,
    type: "integer",
    description: "Идентификатор СУ",
    example: 1
  })
  public id: number
  @ApiProperty({
    required: false,
    type: "string",
    description: "Наименование СУ",
    example: "ВКБ-Ноовостройки"
  })
  public name: string
}