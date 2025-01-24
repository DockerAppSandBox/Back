import express from 'express';
import UserController from "../controllers/user";

const Router = express.Router();

Router.post("/", UserController.createUser);
Router.get("/:id", UserController.getUserById);
Router.get("/", UserController.getAllUsers);
Router.put("/:id", UserController.updateUser);
Router.delete("/:id", UserController.deleteUser);


export default Router;