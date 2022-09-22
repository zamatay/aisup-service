import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "../../services/base.service";
import { AddCommentDto, CommentDto } from "../../dto/comment-dto";

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
                .orderBy('n.id', "DESC")
                .execute();
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }

    async getCommentById(id: number): Promise<CommentDto | false> {
        try {
            return await this.manager.createQueryBuilder()
                .select(["n.id", "type_id as object_id", "n.object_id as line_id", "note_text as text", "s.fio", "n.dateCreate as date"])
                .from("_Note", "n")
                .leftJoin("_users", "u", "u.id=n.creator")
                .leftJoin("ok_staff", "s", "s.id=u.staff_id")
                .where("n.id=:id", { id })
                .orderBy('n.id', "DESC")
                .getRawOne();
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }

    async addComment(params: AddCommentDto): Promise<CommentDto | false> {
        try {
            const {user_id, object_id, line_id, text} = params;
            const data = await this.query('exec _AddNote :user_id, :object_id, :line_id, :text', {user_id, object_id, line_id, text})
            const id = data[0]?.id;
            return this.getCommentById(id)
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
            //console.log(query.getSql());
            return query.execute();
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }
}
