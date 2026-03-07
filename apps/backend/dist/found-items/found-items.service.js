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
exports.FoundItemsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const found_item_entity_1 = require("./entities/found-item.entity");
const found_items_mapper_1 = require("./found-items.mapper");
let FoundItemsService = class FoundItemsService {
    constructor(foundItemsRepository) {
        this.foundItemsRepository = foundItemsRepository;
    }
    findAll() {
        return this.foundItemsRepository.find({
            relations: ['category', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findTop(limit) {
        const items = await this.foundItemsRepository.find({
            relations: ['category', 'user'],
            order: { createdAt: 'DESC' },
            take: limit === undefined ? undefined : limit,
        });
        console.log(items);
        return items.map((item) => (0, found_items_mapper_1.mapFoundItemToVo)(item));
    }
    async findOne(id) {
        if (id <= 0) {
            return null;
        }
        const item = await this.foundItemsRepository.findOne({
            where: { id },
            relations: ['category', 'user'],
        });
        if (item) {
            await this.foundItemsRepository.increment({ id }, 'viewCount', 1);
        }
        return item;
    }
    create(data) {
        const foundItem = this.foundItemsRepository.create({
            ...data,
            commentCount: 0,
            viewCount: 0,
        });
        return this.foundItemsRepository.save(foundItem);
    }
    async update(id, data) {
        await this.foundItemsRepository.update(id, data);
        return this.findOne(id);
    }
    async delete(id) {
        await this.foundItemsRepository.delete(id);
    }
    findByUser(userId) {
        return this.foundItemsRepository.find({
            where: { userId },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.FoundItemsService = FoundItemsService;
__decorate([
    (0, common_1.Get)('top'),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FoundItemsService.prototype, "findTop", null);
exports.FoundItemsService = FoundItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(found_item_entity_1.FoundItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FoundItemsService);
//# sourceMappingURL=found-items.service.js.map