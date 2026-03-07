"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFoundItemToVo = mapFoundItemToVo;
function mapFoundItemToVo(item) {
    return {
        id: item.id,
        title: item.title,
        category: item.category,
        time: item.time.toISOString(),
        storageLocation: item.storageLocation,
        contactPhone: item.contactPhone,
        status: item.status,
        description: item.description,
        location: item.location,
        image: item.image,
        user: item.user,
        commentCount: item.commentCount,
    };
}
//# sourceMappingURL=found-items.mapper.js.map