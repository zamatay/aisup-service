import { ApiProperty } from "@nestjs/swagger";

export class User{
  @ApiProperty({
    type: "number",
    description: "Идентификатор записи",
    example: 1
  })
  id: number

  @ApiProperty({
    type: "string",
    description: "Логин пользователя",
    example: "Ivanov"
  })
  login: string

  @ApiProperty({
    type: "boolean",
    description: "Является админом",
    example: 1
  })
  isAdmin: boolean

  @ApiProperty({
    type: "number",
    description: "Идентификатор персонала",
    example: "45"
  })
  staff_id: number

  @ApiProperty({
    type: "string",
    description: "Дата выдачи JWT",
    example: "Ivanov"
  })
  iat: number

  @ApiProperty({
    type: "string",
    description: "Дата действия JWT",
    example: "Ivanov"
  })
  exp: number
}