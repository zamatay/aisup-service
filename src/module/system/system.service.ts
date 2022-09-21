import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "../../services/base.service";
import { AddCommentDto, CommentDto } from "../../dto/comment-dto";
import { User } from "../../dto/User";

@Injectable()
export class SystemService extends BaseService{
    meta = {
        'id': 'number',
        'del': 'boolean',
        'number': 'number',
        'dateCreate': 'date',
        'dateEdit': 'date',
        'date_edit': {alias: "isnull(DateEdit,DateCreate)", type:'date'},
    }

    allowTables = ['ds_urgency', 'ok_staff, workGroup', 'groupParticipant', 'ok_staff', 'qe_tests', 'qe_TestGroups', 'qe_TestTypes', 'Test_question', 'Test_answer', 'Test_require'];

    async getComments(object_id: number, id: number): Promise<CommentDto[] | false> {
        try {
            return await this.manager.createQueryBuilder()
                .select(["n.id", "type_id as object_id", "n.object_id as line_id", "note_text as text", "s.fio", "n.dateCreate as date"])
                .from("_Note", "n")
                .leftJoin("_users", "u", "u.id=n.creator")
                .leftJoin("ok_staff", "s", "s.id=u.staff_id")
                .where("n.del = 0 and n.type_id = :object_id and n.object_id=:id", { object_id, id })
                .execute();
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }

    async addComment(params: AddCommentDto, user: User): Promise<boolean> {
        try {
            await this.manager.createQueryBuilder()
                .insert()
                .into("_note", ["Creator", "DateCreate", "type_id", "object_id", "note_text"])
                .values([{
                    Creator: user.id,
                    DateCreate: () => "GetDate()",
                    type_id: params.object_id,
                    object_id: params.line_id,
                    note_text: params.text
                }
                ])
                .execute()
            return true;
        } catch (e) {
            console.log(e.message);
            return false;
        }

    }

    async getData(params: any) {
        try {
            const { fields = "*", table, ...filter } = params;
            if (!table)
                return false;
            const isFind = this.allowTables.filter(item=>item.toLowerCase() === table.toLowerCase());
            if (!isFind){
                throw new NotFoundException('Table not found');
            }
            const query = this.manager.createQueryBuilder()
                .select(this.getSelectMeta(fields, this.meta))
                .from(table, "a");
            this.addFilter(query, filter, this.meta);
            return query.execute();
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }
}
