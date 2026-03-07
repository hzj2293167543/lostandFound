"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const categories_module_1 = require("./categories/categories.module");
const lost_items_module_1 = require("./lost-items/lost-items.module");
const found_items_module_1 = require("./found-items/found-items.module");
const announcements_module_1 = require("./announcements/announcements.module");
const comments_module_1 = require("./comments/comments.module");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const path_1 = __importDefault(require("path"));
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const config_1 = require("@nestjs/config");
const env = process.env.NODE_ENV || 'development';
const filePath = path_1.default.join(__dirname, '..', 'config', `.env.${env}.yaml`);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    () => {
                        return yaml.load(fs.readFileSync(filePath, 'utf8'));
                    },
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: configService.get('database.type'),
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.database'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
                    synchronize: false,
                    logging: false,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            categories_module_1.CategoriesModule,
            lost_items_module_1.LostItemsModule,
            found_items_module_1.FoundItemsModule,
            announcements_module_1.AnnouncementsModule,
            comments_module_1.CommentsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map