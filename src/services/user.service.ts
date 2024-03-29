import { Injectable } from '@nestjs/common';
import { BaseService } from "./base.service";
import { UserDto } from "../dto/user-dto";
import { User } from "../dto/User";

@Injectable()
export class UserService extends BaseService{

  constructor(props) {
    super(props)
  }

  public async getUserByLogin(login: string, select: string[] = ['u.id', 'u.login', 'u.isAdmin', 'u.staff_id', 'u.password']) {
    // console.log(this.queryBuilder()
    //     .select(select)
    //     .from("_users", "u")
    //     .where("u.del = 0 and u.IsLocked = 0 and u.login = :login", { login })
    //     .getQueryAndParameters());
    return await this.queryBuilder()
      .select(select)
      .from('_users', 'u')
      .where('u.del = 0 and u.IsLocked = 0 and u.login = :login', {login})
      .getRawOne();
  }

  public async getUserById(id: number, select: string[] = ['u.id', 'u.login', 'u.isAdmin', 'u.staff_id']) {
    return await this.queryBuilder()
      .select(select)
      .from('_users', 'u')
      .where('u.del = 0 and u.IsLocked = 0 and u.id = :id', {id})
      .getRawOne();
  }

  public async getUserBy(filter: Record<string, any>[], select: string[] = ['u.id', 'u.login', 'u.isAdmin', 'u.staff_id']) {
    const queryUser = this.queryBuilder()
      .select(select)
      .from('_users', 'u')
      .leftJoin('s_token', 't', 'u.id=t.user_id')
      .where('u.del = 0 and isnull(u.IsLocked, 0) = 0')
    for(let f of filter){
      const [fieldName, value] = Object.entries(f)[0];
      let parameter = {};
      parameter[fieldName] = value;
      queryUser.andWhere(`${fieldName} = :${fieldName}`, parameter)
    }

    //console.log(queryUser.getSql(), queryUser.getParameters());

    return await queryUser.getRawOne();
  }

}
