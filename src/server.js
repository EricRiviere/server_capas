//Modules imports:
import express from "express";
import handlebars from "express-handlebars";
import Handlebars from "handlebars";

//Passport imports
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/usersConfig.js";

//Routers imports:
import { ProductRouter } from "./routes/api/products.routes.js";
import { CartsRouter } from "./routes/api/carts.routes.js";
import { viewsRouter } from "./routes/views/views.routes.js";
import usersRouter from "./routes/api/users.routes.js";
import userViewRouter from "./routes/views/users.views.routes.js";
import jwtRouter from "./routes/api/jwt.routes.js";
import githubLoginViewsRouter from "./routes/views/github-login.views.routes.js";

//Assets imports:
import { Server } from "socket.io";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import basePath from "./utils/path.js";
import messagesDao from "./dao/mdbManagers/messages.dao.js";

//Config imports
import config from "./config/config.js";
import MongoSingleton from "./config/mongodb_Singleton.js";
import cors from "cors";

//Server
const app = express();
const PORT = config.port;
const httpServer = app.listen(PORT, () => {
  `Server listening on port ${PORT}`;
});

//Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializePassport();
app.use(passport.initialize());
app.use(cors());

//Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      ifRoleEquals: function (role, targetRole, options) {
        return role === targetRole ? options.fn(this) : options.inverse(this);
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", `${basePath}/views`);

//Static
app.use(express.static(`${basePath}/public`));

//Mongoose
const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    console.log(error);
  }
};
mongoInstance();

//SocketServer
const io = new Server(httpServer);

//Cookies
app.use(cookieParser("CoderS3cr3tC0d3"));

//Api routers
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/jwt", jwtRouter);

//ViewRouter
app.use("/", viewsRouter);
app.use("/users", userViewRouter);
app.use("/github", githubLoginViewsRouter);

//Socket
io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("message", async (data) => {
    console.log(data);
    await messagesDao.createMessage(data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});
