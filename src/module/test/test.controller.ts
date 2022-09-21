import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { IRegDocumentGroup } from "../reg-doc/dto/document-dto";
import { TestService } from "./test.service";
import { IAnswer, IQueston } from "./dto/test-dto";

@Controller('api/test')
export class TestController {

    constructor(private readonly service: TestService) {
    }

    @ApiOperation({ summary: 'Получение Вопросов к тестам' })
    @ApiResponse({ status: 200, description: 'Возвращает вопросы к тестам', type: IQueston, isArray: true})
    @Get('getQuestions')
    async getQuestions(@Query() params): Promise<IQueston[] | false>{
        return await this.service.getQuestions(params);
    }

    @ApiOperation({ summary: 'Получение Ответов к тестам' })
    @ApiResponse({ status: 200, description: 'Возвращает ответы к тестам', type: IAnswer, isArray: true})
    @Get('getAnswers')
    async getAnswers(@Query() params): Promise<IAnswer[] | false>{
        return await this.service.getAnswers(params);
    }

}
