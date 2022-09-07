import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/app/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WsAdapter } from "@nestjs/platform-ws";
import { json } from "express";

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  app.use(json({limit: '50mb'}));

  //config swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('Api компаний ВКБ')
    .setDescription('Документация к api')
    .setVersion('2.0.0')
    .build()
  const swaggerOptions = {swaggerOptions: { defaultModelsExpandDepth: -1 }}
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, document, swaggerOptions)
  //end config swagger

  //app.useGlobalGuards(JwtAuthGuard);
  await app.listen(PORT, ()=>{
    console.log(`server start on port ${PORT}`);
  });

}
bootstrap();
