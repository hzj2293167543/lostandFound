"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAnnouncementToVo = mapAnnouncementToVo;
function mapAnnouncementToVo(announcement) {
    return {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        time: announcement.time.toISOString(),
        author: {
            id: announcement.author.id,
            name: announcement.author.name,
        },
    };
}
//# sourceMappingURL=announcements.mapper.js.map