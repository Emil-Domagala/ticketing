import { Router } from 'express';
import * as userController from '../controller/userController.ts';
import { checkIfErrorsFromValidator, validateSignup } from '../middleware/validateRequest.ts';
import { currentUser } from '../middleware/authMiddleware.ts';

const userRoutes = Router();

userRoutes.get('/current-user', currentUser, userController.currentUser);
userRoutes.post('/signin', validateSignup, checkIfErrorsFromValidator, userController.signin);
userRoutes.post('/signup', validateSignup, checkIfErrorsFromValidator, userController.signup);
userRoutes.post('/signout', userController.signout);

export default userRoutes;
