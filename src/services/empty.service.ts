import { Injectable } from '@nestjs/common';
import { BaseService } from "./base.service";

@Injectable()
export class UserService extends BaseService{

  constructor(props) {
    super(props)
  }


}
