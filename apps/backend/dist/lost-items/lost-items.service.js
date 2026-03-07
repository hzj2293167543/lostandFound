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
exports.LostItemsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lost_item_entity_1 = require("./entities/lost-item.entity");
const lost_items_mapper_1 = require("./lost-items.mapper");
let LostItemsService = class LostItemsService {
    constructor(lostItemsRepository) {
        this.lostItemsRepository = lostItemsRepository;
    }
    async findAll() {
        return this.lostItemsRepository.find({
            relations: ['category', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findTop(limit) {
        const items = await this.lostItemsRepository.find({
            relations: ['category', 'user'],
            order: { createdAt: 'DESC' },
            take: limit === undefined ? undefined : limit,
        });
        console.log(items);
        return items.map((item) => (0, lost_items_mapper_1.mapLostItemToVo)(item));
    }
    async findOne(id) {
        const item = await this.lostItemsRepository.findOne({
            where: { id },
            relations: ['category', 'user'],
        });
        if (item) {
            await this.lostItemsRepository.increment({ id }, 'viewCount', 1);
        }
        return item;
    }
    async create(data) {
        const lostItem = this.lostItemsRepository.create({
            ...data,
            commentCount: 0,
            viewCount: 0,
        });
        return this.lostItemsRepository.save(lostItem);
    }
    async update(id, data) {
        await this.lostItemsRepository.update(id, data);
        return this.findOne(id);
    }
    async delete(id) {
        await this.lostItemsRepository.delete(id);
    }
    async findByUser(userId) {
        return this.lostItemsRepository.find({
            where: { user: { id: userId } },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.LostItemsService = LostItemsService;
exports.LostItemsService = LostItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lost_item_entity_1.LostItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LostItemsService);
//# sourceMappingURL=lost-items.service.js.map