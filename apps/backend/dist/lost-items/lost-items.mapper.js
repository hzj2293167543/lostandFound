"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLostItemToVo = mapLostItemToVo;
function mapLostItemToVo(item) {
    return {
        id: item.id,
        title: item.title,
        category: {
            id: item.category.id,
            name: item.category.name,
        },
        description: item.description,
        time: item.time.toISOString(),
        location: item.location,
        status: item.status,
        image: item.image,
        commentCount: item.commentCount,
        user: {
            id: item.user.id,
            name: item.user.name,
            avatar: item.user.avatar,
        },
    };
}
//# sourceMappingURL=lost-items.mapper.js.map