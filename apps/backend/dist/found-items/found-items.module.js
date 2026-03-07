"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundItemsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const found_items_service_1 = require("./found-items.service");
const found_items_controller_1 = require("./found-items.controller");
const found_item_entity_1 = require("./entities/found-item.entity");
let FoundItemsModule = class FoundItemsModule {
};
exports.FoundItemsModule = FoundItemsModule;
exports.FoundItemsModule = FoundItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([found_item_entity_1.FoundItem])],
        controllers: [found_items_controller_1.FoundItemsController],
        providers: [found_items_service_1.FoundItemsService],
        exports: [found_items_service_1.FoundItemsService],
    })
], FoundItemsModule);
//# sourceMappingURL=found-items.module.js.map