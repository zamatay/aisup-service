import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/jwt-auth-guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { NotifyTask, Task, TaskRead, TaskStates, TaskValue } from "./dto/task-dto";
import { IdDto } from "../../dto/id-dto";
import { IdNameDto } from "../../dto/id-name-dto";

@UseGuards(JwtAuthGuard)
@ApiTags('Задачи')
@Controller('api/task')
export class TaskController {

    constructor(private readonly taskService: TaskService) {
    }

    @ApiOperation({ summary: 'Получение задач' })
    @ApiResponse({ status: 200, description: 'Возвращает список задач', type: Task, isArray: true})
    @Get('/')
    async documents(@Query() params): Promise<Task[] | false>{
        return await this.taskService.getTasks(params);
    }

    @ApiOperation({ summary: 'Установить выполнение задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает выполненную/cнятую задачу', type: Task})
    @Post('setExecute')
    async execute(@Body('task_id') task_id: number, @Body('value') value: boolean, @Req() req): Promise<Task | boolean>{
        return await this.taskService.setExecute(task_id, value, req.user.id);
    }

    @ApiOperation({ summary: 'Выполнить/снять задачу' })
    @ApiResponse({ status: 200, description: 'Возвращает выполненную/cнятую задачу', type: Task})
    @Post('toggleExecute')
    async toggleExecute(@Body('task_id') task_id: number, @Body('staff_id') staff_id: number, @Req() req): Promise<Task | boolean>{
        return await this.taskService.toggleExecute(task_id, req.user.id, staff_id);
    }

    @ApiOperation({ summary: 'Установить значение прочитанности задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает задачу', type: Task})
    @Post('setRead')
    async read(@Body('task_id') task_id: number, @Body('value') value: boolean, @Req() req): Promise<TaskValue | boolean>{
        return await this.taskService.setRead(task_id, value, req.user);
    }

    @ApiOperation({ summary: 'Установить/снять прочитанность задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает задачу', type: Task})
    @Post('toggleRead')
    async toggleRead(@Body('task_id') task_id: number, @Body('staff_id') staff_id: number, @Req() req): Promise<TaskValue | boolean>{
        return await this.taskService.toggleRead(task_id, staff_id, req.user);
    }

    @ApiOperation({ summary: 'Установить значение подтвержденности задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает задачу', type: Task})
    @Post('setConfirm')
    async setConfirm(@Body('task_id') task_id: number, @Body('value') value: boolean, @Req() req): Promise<Task | boolean>{
        return await this.taskService.setConfirm(task_id, value, req.user);
    }

    @ApiOperation({ summary: 'Установить/снять подтверждение задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает задачу', type: Task})
    @Post('toggleConfirm')
    async toggleConfirm(@Body('task_id') task_id: number, @Body('staff_id') staff_id: number, @Req() req): Promise<Task | boolean>{
        return await this.taskService.toggleConfirm(task_id, req.user.id, staff_id ?? req.user.staff_id);
    }

    @ApiOperation({ summary: 'Установить значение активности задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает задачу', type: Task})
    @Post('setActive')
    async setActive(@Body('task_id') task_id: number, @Body('value') value: boolean, @Req() req): Promise<Task | boolean>{
        return await this.taskService.setActive(task_id, value, req.user);
    }

    @ApiOperation({ summary: 'Установить/снять активность задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает задачу', type: Task})
    @Post('toggleActive')
    async toggleActive(@Body('task_id') task_id: number, @Body('staff_id') staff_id: number, @Req() req): Promise<Task | boolean>{
        return await this.taskService.toggleActive(task_id, req.user.id, staff_id);
    }
    @ApiOperation({ summary: 'Получить события по задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает выполненную/cнятую задачу', type: NotifyTask, isArray: true})
    @Get('getNotify')
    async getNotify(@Query('task_id') task_id: number, @Req() req): Promise<any>{
        return await this.taskService.getNotify(req.user.staff_id);
    }

    @ApiOperation({ summary: 'Получить состояние задач'})
    @ApiResponse({ status: 200, description: 'Возвращает состояние переданных задач', type: TaskStates, isArray: true})
    @Get('getTaskStates')
    async getTaskStates(@Query('ids') ids: number[], @Query('staff_id') staff_id: number): Promise<TaskStates[] | false>{
        return await this.taskService.getTaskStates(ids, staff_id);
    }

    @ApiOperation({ summary: 'Получить список прочитавших'})
    @ApiResponse({ status: 200, description: 'Возвращает список прочитавших задачу', type: TaskStates, isArray: true})
    @Get('getReaders')
    async getReaders(@Query('ids') ids: number[], @Req() req): Promise<TaskRead[] | false>{
        return await this.taskService.getReaders(ids);
    }

    @ApiOperation({ summary: 'Получить список Важности'})
    @ApiResponse({ status: 200, description: 'Возвращает список Важности', type: IdNameDto, isArray: true})
    @Get('getUrgency')
    async getUrgency(): Promise<any[]>{
        return await this.taskService.getUrgency();
    }

    @ApiOperation({ summary: 'Получить непрочитанные задачи'})
    @ApiResponse({ status: 200, description: 'Возвращает список непрочитанных задач', type: IdDto, isArray: true})
    @Get('getNotReaders')
    async getNotReaders(@Query('staff_id') staff_id: number): Promise<IdDto[] | false>{
        return await this.taskService.getNotReaders(staff_id);
    }

    @ApiOperation({ summary: 'Получить задачи по тексту комментария'})
    @ApiResponse({ status: 200, description: 'Возвращает id найденных задач', type: IdDto, isArray: true})
    @Get('getTaskByCommentText')
    async getTaskByCommentText(@Query('text') text: string): Promise<IdDto[] | false>{
        return await this.taskService.getTaskByCommentText(text);
    }

    @ApiOperation({ summary: 'Получить связные задачи'})
    @ApiResponse({ status: 200, description: 'Возвращает id найденных задач', type: IdDto, isArray: true})
    @Get('getRelatedTask')
    async getRelatedTask(@Query('staff_id') staff_id: number, @Query('id') task_id: string): Promise<IdDto[] | false>{
        return await this.taskService.getRelatedTask(staff_id, task_id);
    }
}
