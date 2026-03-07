"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostItemsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lost_items_service_1 = require("./lost-items.service");
const lost_items_controller_1 = require("./lost-items.controller");
const lost_item_entity_1 = require("./entities/lost-item.entity");
let LostItemsModule = class LostItemsModule {
};
exports.LostItemsModule = LostItemsModule;
exports.LostItemsModule = LostItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([lost_item_entity_1.LostItem])],
        controllers: [lost_items_controller_1.LostItemsController],
        providers: [lost_items_service_1.LostItemsService],
        exports: [lost_items_service_1.LostItemsService],
    })
], LostItemsModule);
//# sourceMappingURL=lost-items.module.js.map