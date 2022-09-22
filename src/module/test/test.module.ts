import { Module } from "@nestjs/common";
import { TestController } from "./test.controller";
import { TestService } from "./test.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [AuthModule]
})
export class TestModule {}
