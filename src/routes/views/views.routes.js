import { Router } from "express";
import productsDao from "../../dao/mdbManagers/products.dao.js";
import cartsDao from "../../dao/mdbManagers/carts.dao.js";
import { authorization } from "../../utils/auth.js";
import { passportCall } from "../../utils/passport.js";

const viewsRouter = Router();

//Basic redirection
viewsRouter.get("/", (req, res) => {
  res.redirect("/users/register");
});

//Product Manager
viewsRouter.get(
  "/productmanager",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    const products = await productsDao.getAllProducts();
    res.render("productManager", {
      title: "Products Mongoose",
      products,
      user: req.user,
    });
  }
);

//Chat
viewsRouter.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
  });
});

//Products
viewsRouter.get(
  "/products",
  passportCall("jwt"),
  authorization(["admin", "user"]),
  async (req, res) => {
    const { page, limit, sort } = req.query;
    const products = await productsDao.getAllProducts(page, limit, sort);
    res.render("products", {
      title: "Products",
      products,
      user: req.user,
    });
  }
);

//Carts
viewsRouter.get("/carts/", async (req, res) => {
  const carts = await cartsDao.getAllCarts();
  res.render("carts", {
    title: "Carts",
    carts,
  });
});

//Cart
viewsRouter.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsDao.getCartById(cid);
  res.render("cart", {
    title: "Cart",
    cart,
  });
});

export { viewsRouter };
