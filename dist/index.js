"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Routes_1 = __importDefault(require("./routes/Routes"));
const bodyParser = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const qs_1 = __importDefault(require("qs"));
dotenv_1.default.config();
if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log(process.env.NODE_ENV, `RejectUnauthorized is disabled.`);
}
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.WEB_URL,
    method: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(bodyParser.json());
const port = process.env.PORT || 5000;
app.set('query parser', function (str) {
    return qs_1.default.parse(str);
});
app.listen(port, () => {
    console.log(`Application is running on port ${port}.`);
});
app.use("/api", Routes_1.default);
