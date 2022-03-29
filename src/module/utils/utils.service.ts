import { Injectable, UseGuards } from "@nestjs/common";
import { BaseService } from "../../services/base.service";
import { FirmDto } from "../../dto/firm-dto";
import { JwtAuthGuard } from "../../jwt-auth-guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Injectable()
export class UtilsService extends BaseService{

  async getFirmsByUserId(userId: number): Promise<Promise<FirmDto[]> | any> {
    try {
      const data = await this.manager.createQueryBuilder()
        .from("OurFirms", "f")
        .select(["id", "name"])
        .where("id IN (select id from dbo._GetRightRows ('RIGHT_FIRM_LINE', :userId))", { userId })
        .getRawMany();
      return data;
    } catch (e) {
      return this.returnBad()
    }
  }
}
