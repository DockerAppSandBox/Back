import express from "express";
import {
    GetTest
} from "../controllers/user"

const Router = express.Router();

Router.get("/test", GetTest)

export default Router;