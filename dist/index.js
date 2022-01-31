"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const error_handler_middleware_1 = __importDefault(
  require("./middlewares/error-handler-middleware"),
);
const Bearer_authentication_middleware_1 = __importDefault(
  require("./middlewares/Bearer-authentication.middleware"),
);
const authorization_router_1 = __importDefault(
  require("./routes/authorization.router"),
);
const products_router_1 = __importDefault(require("./routes/products.router"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const purchases_router_1 = __importDefault(
  require("./routes/purchases.router"),
);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/token", authorization_router_1.default);
app.use("/users", users_route_1.default);
app.use("/products", products_router_1.default);
app.use(
  "/purchase",
  Bearer_authentication_middleware_1.default,
  purchases_router_1.default,
);
app.use(error_handler_middleware_1.default);
const door = process.env.PORT || 3030;
app.listen(door, () => {
  console.log(`Server online na porta ${door}`);
});
app.get("/status", (req, res, next) => {
  res.sendStatus(http_status_codes_1.StatusCodes.OK);
});
