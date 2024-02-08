import { Router } from "express";
import {
  getCartsController,
  getCartController,
  postCartController,
  postProductInCartController,
  putProductsInCartController,
  putProductQuantityInCartController,
  deleteCartController,
  deleteProductFromCartController,
} from "../../controllers/cartsControllers.js";

const CartsRouter = Router();

//Get carts
CartsRouter.get("/", getCartsController);

//Get carts
CartsRouter.get("/:cid", getCartController);

//Post cart
CartsRouter.post("/", postCartController);

//post product in cart
CartsRouter.post("/:cid/product/:pid", postProductInCartController);

//put products in cart
CartsRouter.put("/:cid", putProductsInCartController);

//put product quantity in  cart
CartsRouter.put("/:cid/products/:pid", putProductQuantityInCartController);

//delete cart
CartsRouter.delete("/:cid", deleteCartController);

//delete product from cart
CartsRouter.delete("/:cid/products/:pid", deleteProductFromCartController);

export { CartsRouter };
