import { Injectable } from "@nestjs/common";
import { NotifyTask, Task, TaskRead, TaskStates, TaskValue } from "./dto/task-dto";
import { BaseService } from "../../services/base.service";
import { User } from "../../dto/User";
import { IdDto } from "../../dto/id-dto";
import { SelectQueryBuilder } from "typeorm";

@Injectable()
export class TaskService extends BaseService{
    taskMeta = {
        'id': 'number',
        'del': 'boolean',
        'number': 'number',
        'task': {alias: 'zadanie', type: 'number'},
        'theme': 'string',
        'disabled': 'boolean',
        'confirmation': 'boolean',
        'receiver_id': {alias: 'receiver', type: "integer"},
        'sender_id': {alias: 'sender', type: "integer"},
        'plandateto': 'date',
        'plandatefrom': 'date',
        'isexecute': {alias: "cast(isnull(factDateTo,0) as bit)"},
        'urgency_id': {alias: 'urgency', type: "integer"},
        'task_group_id': {alias: 'workgroup_id', type: "integer"},
        'dateedit': {alias: 'isnull(DateEdit, DateCreate)', type: "date"},
    }

    addStaffFilter(staff_id: number, query: SelectQueryBuilder<any>){
        const tableAlias = query.alias ?? 'd';
        query.andWhere((qb)=>qb.where(`
            sender=:staff_id or receiver=:staff_id or :staff_id in (select staff_id from  c_DisposalMembers where del = 0 and disposal_id = ${tableAlias}.id
                union
            select s.id
            from GroupParticipant g
                inner join ok_staff s on s.id = g.Participantid and g.participantType=735
            where g.del = 0 and g.WorkGroupID=${tableAlias}.WorkGroup_id)`, {staff_id}));
    }

    async getTasks(params): Promise<Task[] | false> {
        try {
            const { fields, staff_id, ...filter} = params;
            const query = this.manager.createQueryBuilder()
                .from("DS_Disposals", "d")
                .where("d.del = 0");
            if (filter)
                this.addFilter(query, filter, this.taskMeta);
            query.select(this.getSelectMeta(fields, this.taskMeta));
            //console.log(query.getSql());
            return await query.execute();
        } catch (e) {
            console.log(e.message);
            return false
        }
    }

    async getTaskById(id): Promise<Task | false> {
        try {
            const query = this.manager.createQueryBuilder()
                .from("DS_Disposals", "d")
                .where("d.id = :id", { id });
            query.select(this.getSelect(this.taskMeta));
            return await query.getRawOne();
        } catch (e) {
            console.log(e.message);
            return false
        }
    }

    async setExecute(task_id, value, user_id): Promise<Task | boolean> {
        try {
            const data = await this.manager.createQueryBuilder()
                .update("DS_Disposals")
                .set({
                    FactDateTo: () => (value == 1) ? "getDate()" : "NULL",
                    Editor: user_id,
                    DateEdit: () => "getDate()"
                })
                .where("id=:id", { id: task_id })
                .execute();
            if (data.affected === 1)
                return this.getTaskById(task_id);
            else
                return false;
        } catch (e) {
            console.log(e.message);
            return false
        }
    }

    async getNotify(staff_id: number) : Promise<NotifyTask> {
        return await this.query("exec GetNotifyTask :staff_id, 1, 0, 1, 0", {staff_id})
    }

    async setRead(task_id: number, value: boolean, user: User) {
        try {
            if (value) {
                await this.query(`if not exists (select 1 from dbo.DS_Readed where Personal=:staff_id and Disposal=:task_id and del=0) 
                        INSERT INTO dbo.DS_Readed (Creator, DateCreate, Personal, Disposal)
                        SELECT :user_id, GETDATE(), :staff_id, :task_id`
                    , { staff_id: user.staff_id, user_id: user.id, task_id });
            } else {
                await this.query(`delete from dbo.DS_Readed where Personal=:staff_id and Disposal=:task_id and del=0`
                    , { staff_id: user.staff_id, task_id });
            }
            return {task_id, value};
        } catch (e) {
            console.log(e.message);
            return false
        }
    }

    async toggleExecute(task_id: number, user_id: number): Promise<Task | false> {
        try {
            const data = await this.manager.createQueryBuilder()
                .update("DS_Disposals")
                .set({
                    FactDateTo: () => "case when factDateTo is null then getDate() else null end",
                    Editor: user_id,
                    DateEdit: () => "getDate()"
                })
                .where("id=:id", { id: task_id })
                .execute();
            if (data.affected === 1)
                return this.getTaskById(task_id);
            else
                return false;
        } catch (e) {
            console.log(e.message);
            return false
        }
    }

    async toggleRead(task_id: number, staff_id: number, user: User): Promise<TaskValue | false> {
        try {
            return (await this.query('exec ds_toggleRead :user_id, :staff_id, :task_id', { user_id: user.id, staff_id, task_id }))[0];
        } catch (e) {
            console.log(e.message);
            return false
        }
    }

    async getTaskStates(ids: number[], staff_id: number): Promise<TaskStates[] | false>{
        try {
            if (typeof ids === "string") {
                ids = [ids];
            } else if (typeof ids === "object" && !Array.isArray(ids)) {
                ids = Object.values(ids);
            }
            return await this.manager.createQueryBuilder()
                .select(["d.id", "cast(cast(FactDateTo as bit) as int) IsExec", "cast(Confirmation as int) IsConfirm", "cast(cast(notRead.id as bit) as int) IsNotRead", "cast(Disabled as int) IsDisable"])
                .from("ds_disposals", "d")
                .leftJoin(`(SELECT id FROM dbo.GetNotifyTaskByType(:staff_id, 1) where type = 2)`, "notRead", "notRead.id = d.id", { staff_id })
                .where("d.id in (:...ids)", { ids })
                .execute();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getReaders(ids: number[] | number): Promise<TaskRead[] | false> {
        try {
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            return await this.manager.createQueryBuilder()
                .select(["disposal as id", "personal staff_id", "r.DateCreate as date", "s.fio"])
                .from("ds_readed", "r")
                .leftJoin("ok_staff", "s", "s.id=r.personal")
                .where("r.del = 0 and disposal in (:...ids)", { ids })
                .orderBy("r.dateCreate")
                .execute();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getUrgency() {
        try {
            return await this.manager.createQueryBuilder()
                .select(["id", "name"])
                .from("ds_urgency", "u")
                .where("del = 0 ")
                .orderBy("name")
                .execute();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getNotReaders(staff_id: number): Promise<IdDto[] | false> {
        try {
            return await this.query('select id from dbo.GetNotifyTaskByType(:staff_id, 1) where type = 2', {staff_id})
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getTaskByCommentText(text: string) {
        try {
            if (text)
            return await this.manager.createQueryBuilder()
                .select(["object_id as id"])
                .from("_note", "u")
                .where("del = 0 and type_id=1127 and note_text like :text", {text})
                .execute();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getRelatedTask(staff_id: number, task_id: string) {
        try {
            const query = this.manager.createQueryBuilder()
                .select(["id"])
                .from("ds_disposals", "d")
                .innerJoin((qb)=>qb
                    .select('case when rootParent = 0 then id else rootParent end rootParent')
                    .from('ds_disposals', 'd1')
                    .where('d1.id=:task_id', {task_id}), 'd1'
                , 'd1.rootParent in (d.rootParent, d.id)', {task_id})
                .where("d.del=0")
            this.addStaffFilter(staff_id, query);
            return await query.execute()
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
