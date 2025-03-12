import { Router } from 'express';
import * as userController from '../controller/userController.ts';
import { validateSignup } from '../middleware/validateRequest.ts';

const userRoutes = Router();

userRoutes.get('/currentuser', userController.currentuser);
userRoutes.post('/signin', userController.signin);
userRoutes.post('/signup', validateSignup, userController.signup);
userRoutes.post('/signout', userController.signout);

export default userRoutes;
