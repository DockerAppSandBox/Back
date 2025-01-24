import express from 'express';
import { AuthController } from '../controllers/auth';

const Router = express.Router();

Router.post('/register', AuthController.register);
Router.post('/login', AuthController.login);

export default Router;
