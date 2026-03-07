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
exports.FoundItemsController = void 0;
const common_1 = require("@nestjs/common");
const found_items_service_1 = require("./found-items.service");
const passport_1 = require("@nestjs/passport");
let FoundItemsController = class FoundItemsController {
    constructor(foundItemsService) {
        this.foundItemsService = foundItemsService;
    }
    findAll() {
        return this.foundItemsService.findAll();
    }
    findTop(limit) {
        if (limit === undefined) {
            limit = 10;
        }
        return this.foundItemsService.findTop(limit);
    }
    findByUser(userId) {
        return this.foundItemsService.findByUser(+userId);
    }
    findOne(id) {
        return this.foundItemsService.findOne(+id);
    }
    create(data, req) {
        return this.foundItemsService.create({
            ...data,
            userId: req.user.id,
        });
    }
    update(id, data, req) {
        return this.foundItemsService.update(+id, data);
    }
    delete(id, req) {
        return this.foundItemsService.delete(+id);
    }
};
exports.FoundItemsController = FoundItemsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FoundItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('top'),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FoundItemsController.prototype, "findTop", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundItemsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FoundItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FoundItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoundItemsController.prototype, "delete", null);
exports.FoundItemsController = FoundItemsController = __decorate([
    (0, common_1.Controller)('found-items'),
    __metadata("design:paramtypes", [found_items_service_1.FoundItemsService])
], FoundItemsController);
//# sourceMappingURL=found-items.controller.js.map