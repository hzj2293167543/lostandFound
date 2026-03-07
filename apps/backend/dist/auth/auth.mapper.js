"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userToLoginBackDto = void 0;
const userToLoginBackDto = (user, token) => ({
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        contact: user.contact,
        description: user.description,
        role: user.role,
        status: user.status,
    },
});
exports.userToLoginBackDto = userToLoginBackDto;
//# sourceMappingURL=auth.mapper.js.map