import { ApiProperty } from "@nestjs/swagger";

export class ImportDataColumnsDto{
  @ApiProperty({
    type: "string",
    description: "Наименование колонки",
  })
  Title: string
}

export class ImportDataDataDto{
  @ApiProperty({
    isArray: true,
    type: 'any',
    description: "Значение колонки",
  })
  Title: string
}

export class ImportDataBaseDto {
  @ApiProperty({
    type: [ImportDataColumnsDto],
    description: "Наименование колонок",
    example: [{Title: "ID"},{Title: "Номер"}]
  })
  public Columns: ImportDataColumnsDto

  @ApiProperty({
    type: [['any']],
    description: "Значение колонок",
    example: [["1", "ВКБ Нововстройки"]]
  })
  public Data: ImportDataDataDto

  @ApiProperty({
    type: 'integer',
    description: "Количество записей",
    example: 10
  })
  public totalRow: number

}