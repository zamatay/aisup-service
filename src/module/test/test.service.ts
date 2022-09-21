import { Injectable } from '@nestjs/common';
import { BaseService } from "../../services/base.service";
import { IAnswer, IQueston } from "./dto/test-dto";

@Injectable()
export class TestService extends BaseService{
    async getQuestions(params): Promise<IQueston[] | false> {
        const meta = {
            "id": "number",
            "name": "string",
            "number": "string",
            "test_id": "number",
            "answersIsHorizontal": { alias: "AnswerIsHorizontal" },
            "has_image": { alias: "cast(i.idi as BIT)" },
            'dateedit': {alias: "isnull(DateEdit,DateCreate)", type:'date'},
        };
        try {
            const { fields } = params;
            const query = this.manager.createQueryBuilder()
                .select(this.getSelectMeta(fields, meta))
                .from("qe_Questions", "a")
                .leftJoin("(select id as idi from _Images)", "i", "i.idi = (select top 1 id from _Images where del = 0 and table_id=:table_id and line_id = a.id)", { table_id: 52940 })
                .where("a.del = 0");
            this.addFilter(query, params, meta);
            return await query.execute();
        } catch (e) {
            console.log(e);
            return false
        }
    }

    async getAnswers(params): Promise<IAnswer[] | false> {
        try {
            const meta = {
                "id": "number",
                "name": "string",
                "question_id": "number",
                "isCorrect": "boolean",
                "a.ord": "number",
                "has_image": { alias: "cast(i.idi as BIT)" },
                'dateedit': {alias: "isnull(DateEdit,DateCreate)", type:'date'},
            }
            const { fields } = params;
            const query = this.manager.createQueryBuilder()
                .select(this.getSelectMeta(fields, meta))
                .from("qe_Answers", "a")
                .leftJoin("(select id as idi from _Images)", "i", "i.idi = (select top 1 id from _Images where del = 0 and table_id=:table_id and line_id = a.id)", { table_id: 52946 })
                .where("a.del = 0");
            this.addFilter(query, params, meta);
            return await query.execute();
        } catch (e) {
            console.log(e);
            return false
        }
    }
}
