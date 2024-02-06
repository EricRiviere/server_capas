import { Router } from "express";
import userModel from "../../dao/models/user.model.js";
import { authorization } from "../../utils/auth.js";
import { passportCall, authToken } from "../../utils/passport.js";
import cartsDao from "../../dao/mdbManagers/carts.dao.js";

const router = Router();

router.get("/:userId", authToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(202).json({ message: "User not found with ID: " + userId });
    }
    res.json(user);
  } catch (error) {
    console.error("Error consulting user with ID: " + userId);
  }
});

router.post(
  "/:productId",
  passportCall("jwt"),
  authorization("user"),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const userId = req.user.id;

      let user = await userModel.findById(userId).populate("cart");

      if (!user) {
        throw new Error("User not found");
      }

      let cart;
      if (!user.cart) {
        cart = await cartsDao.createCart();
        user.cart = cart._id;
        await user.save();
      } else {
        cart = user.cart;
      }

      await cartsDao.addProductToCart(cart._id, productId);
      cart = await cartsDao.getCartById(cart._id);
      res.render("cart", {
        title: "Cart",
        cart,
        user: req.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
