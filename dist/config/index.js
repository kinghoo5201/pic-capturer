"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isDev = process.argv[2] === "develop";
const port = 1234;
exports.default = {
    port,
    uploadDir: "/upload/ups/",
    isDev,
};
