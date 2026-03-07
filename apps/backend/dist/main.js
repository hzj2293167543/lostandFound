"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const response_interceptor_1 = require("./common/response.interceptor");
const exception_filter_1 = require("./common/exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new response_interceptor_1.TransformInterceptor());
    const configService = app.get(config_1.ConfigService);
    app.useGlobalFilters(new exception_filter_1.AllExceptionsFilter(configService));
    const port = configService.get('app.port');
    await app.listen(port);
    console.log(`Backend API running on http://localhost:${port}`);
}
const config_1 = require("@nestjs/config");
bootstrap();
//# sourceMappingURL=main.js.map