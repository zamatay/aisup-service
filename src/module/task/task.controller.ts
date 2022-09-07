import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/jwt-auth-guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { NotifyTask, Task, TaskRead, TaskStates, TaskValue } from "./dto/task-dto";

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
    async toggleExecute(@Body('task_id') task_id: number, @Req() req): Promise<Task | boolean>{
        return await this.taskService.toggleExecute(task_id, req.user.id);
    }

    @ApiOperation({ summary: 'Установить прочитанность задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает задачу', type: Task})
    @Post('setRead')
    async read(@Body('task_id') task_id: number, @Body('value') value: boolean, @Req() req): Promise<TaskValue | boolean>{
        return await this.taskService.setRead(task_id, value, req.user);
    }

    @ApiOperation({ summary: 'Прочитать/снять прочитанность задаче' })
    @ApiResponse({ status: 200, description: 'Возвращает задачу', type: Task})
    @Post('toggleRead')
    async toggleRead(@Body('task_id') task_id: number, @Req() req): Promise<TaskValue | boolean>{
        return await this.taskService.toggleRead(task_id, req.user);
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
    async getTaskStates(@Query('ids') ids: number[], @Query('staff_id') staff_id: number): Promise<TaskStates[]>{
        return await this.taskService.getTaskStates(ids, staff_id);
    }

    @ApiOperation({ summary: 'Получить список прочитавших'})
    @ApiResponse({ status: 200, description: 'Возвращает список прочитавших задачу', type: TaskStates, isArray: true})
    @Get('getReaders')
    async getReaders(@Query('ids') ids: number[], @Req() req): Promise<TaskRead[]>{
        return await this.taskService.getReaders(ids);
    }

    @ApiOperation({ summary: 'Получить список прочитавших'})
    @ApiResponse({ status: 200, description: 'Возвращает список прочитавших задачу', type: TaskStates, isArray: true})
    @Get('getUrgency')
    async getUrgency(): Promise<any[]>{
        return await this.taskService.getUrgency();
    }

}