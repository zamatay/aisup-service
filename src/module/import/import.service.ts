import { Injectable } from '@nestjs/common';
import { BaseService } from "../../services/base.service";
import { ImportResulDataDto } from "./dto/import-data-dto";

@Injectable()
export class ImportService extends BaseService{

  async payFrom1C(body: object): Promise<ImportResulDataDto | boolean> {
    try {
      this.addToLog('payFrom1C', body);
      const res = await this.query("exec ImportPayFrom1C :data", { data: JSON.stringify(body) });
      return res[0];
    } catch (e) {
      return false
    }
  }

  async rpFrom1C(body: object) {
    try {
      this.addToLog('rpFrom1C', body);
      const res = await this.query("exec ImportRPFrom1C :data", {data: JSON.stringify(body)});
      return res[0];
    } catch (e) {
      return false
    }
  }
}
