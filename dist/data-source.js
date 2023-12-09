"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./models/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12345",
    database: "taskmaze",
    synchronize: true,
    logging: true,
    entities: [User_1.User],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map