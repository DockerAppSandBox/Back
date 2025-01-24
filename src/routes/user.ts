import express from 'express';
import UserController from "../controllers/user";

const Router = express.Router();

Router.put("/:id", UserController.updateUser);
Router.delete("/:id", UserController.deleteUser);

export default Router;