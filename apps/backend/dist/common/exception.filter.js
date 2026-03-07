"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor(configService) {
        this.configService = configService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                const responseObj = exceptionResponse;
                if (Array.isArray(responseObj.message)) {
                    message = responseObj.message[0];
                }
                else if (responseObj.message) {
                    message = responseObj.message;
                }
            }
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            const err = exception;
            if (err.code === 'ER_DUP_ENTRY') {
                status = common_1.HttpStatus.CONFLICT;
                message = '数据已存在，请勿重复提交';
            }
            else {
                message = '数据库操作失败';
            }
        }
        else if (exception instanceof Error) {
            if (this.configService.get('app.env') === 'development') {
                console.error(exception);
            }
            message = 'Internal server error';
        }
        response.status(status).json({
            code: status,
            message,
            data: null,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, common_1.Inject)(config_1.ConfigService)),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AllExceptionsFilter);
//# sourceMappingURL=exception.filter.js.map