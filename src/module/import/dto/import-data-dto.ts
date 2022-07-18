import { ApiProperty } from "@nestjs/swagger";
import { ImportDataBaseDto } from "../../../dto/import-data-base-dto";

export class ImportResulDataDto{
  @ApiProperty({
    type: 'integer',
    description: "возвращает количество добавленных записей",
    example: 0
  })
  public count: number

}

export class ImportDataDto extends ImportDataBaseDto{
  @ApiProperty({
    type: 'guid',
    description: "guid базы 1С с которой идет выгрузка",
    example: "a6b82911-3136-4f25-9a24-bf8ad91326aa"
  })
  public DBId: string

  @ApiProperty({
    type: 'integer',
    description: "id субъекта учёта",
    example: "73"
  })
  public FirmID: string

  @ApiProperty({
    type: 'boolean',
    description: "пытаться найти аналитики платежа по шаблону или предыдущим оплатам",
    example: "0"
  })
  public WithAnal: string

}