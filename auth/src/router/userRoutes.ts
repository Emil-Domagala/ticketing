import { Router } from 'express';
import * as userController from '../controller/userController';
import { validateSignup } from '../middleware/validateSignup';
import { currentUser } from '@emil_tickets/common';
import { checkIfErrorsFromValidator } from '@emil_tickets/common';

const userRoutes = Router();

userRoutes.get('/current-user', currentUser, userController.currentUser);
userRoutes.post('/signin', validateSignup, checkIfErrorsFromValidator, userController.signin);
userRoutes.post('/signup', validateSignup, checkIfErrorsFromValidator, userController.signup);
userRoutes.post('/signout', userController.signout);

export default userRoutes;
