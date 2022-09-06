import { ApiProperty } from "@nestjs/swagger";

export class Task {
    @ApiProperty({
        type: 'integer',
        description: "Идентификатор записи",
        example: 1
    })
    id:            number;
    @ApiProperty({
        type: 'boolean',
        description: "Признак удаленности",
        example: 0
    })
    del:           boolean;
    @ApiProperty({
        type: 'string',
        description: "Номер задачи",
        example: '105661'
    })
    number:        string;
    @ApiProperty({
        type: 'text',
        description: "Текст задачи",
        example: 'Обнаружена задолженность по оплате договора 2018/06/291002'
    })
    task:          string;
    @ApiProperty({
        type: 'text',
        description: "Тема задачи",
        example: 'Задолженность по договору 2018/06/291002, Кармазин Валерий Дмитриевич'
    })
    theme:         string;
    @ApiProperty({
        type: 'boolean',
        description: "Задача отклонена",
        example: 1
    })
    disabled:      boolean;

    @ApiProperty({
        type: 'number',
        description: "id получателя задачи",
        example: 3424
    })
    receiver_id:   number;

    @ApiProperty({
        type: 'number',
        description: "id отпрвителя задачи",
        example: 3424
    })
    sender_id:     number;

    @ApiProperty({
        type: 'date',
        description: "Планируемая дата исполнения",
        example: null
    })
    plandateto:    Date;

    @ApiProperty({
        type: 'date',
        description: "Планируемая дата начала",
        example: null
    })
    plandatefrom:  Date;

    @ApiProperty({
        type: 'boolean',
        description: "Задача является выполненной",
        example: 1
    })
    isexecute:     boolean;

    @ApiProperty({
        type: 'number',
        description: "id Важности задачи",
        example: 2
    })
    urgency_id:    number;

    @ApiProperty({
        type: 'number',
        description: "id гуппы",
        example: null
    })
    task_group_id: number;
}

export class NotifyTask {
    @ApiProperty({
        type: 'integer',
        description: "id задачи",
        example: 186401
    })
    id:            number;

    @ApiProperty({
        type: 'integer',
        description: "тип события",
        example: 2
    })
    type:            number;

}

export class TaskValue {
    @ApiProperty({
        type: 'integer',
        description: "id задачи",
        example: 186401
    })
    task_id:            number;

    @ApiProperty({
        type: 'any',
        description: "Значение",
        example: 1
    })
    value:            any;

}
export class TaskStates {
    @ApiProperty({
        type: 'number',
        description: "id задачи",
        example: 105660
    })
    id:        number;

    @ApiProperty({
        type: 'number',
        description: "Задача выполнена",
        example: 1
    })
    IsExec:    number;

    @ApiProperty({
        type: 'number',
        description: "Задача подтверждена",
        example: 1
    })
    IsConfirm: number;

    @ApiProperty({
        type: 'number',
        description: "Задача не прочитана",
        example: 1
    })
    IsNotRead: null;

    @ApiProperty({
        type: 'number',
        description: "Задача аннулирована",
        example: 1
    })
    IsDisable: null;
}

export class TaskRead {
    @ApiProperty({
        type: 'number',
        description: "id задачи",
        example: 105660
    })
    id:   number;

    @ApiProperty({
        type: 'number',
        description: "id персонала",
        example: '3424'
    })
    staff_id:   number;

    @ApiProperty({
        type: 'number',
        description: "lfnf ghjxntybz",
        example: '2018-07-16T09:32:56.077Z'
    })
    date: Date;
}
