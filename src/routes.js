import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryManController from './app/controllers/DeliveryManController';

import authMiddleware from './app/middlewares/auth';
import authAdmMiddleware from './app/middlewares/authAdmin';
import multerConfig from './config/multer';

const routes = new Router();

const upload = multer(multerConfig);
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/files', upload.single('file'), FileController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.use(authAdmMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

routes.get('/deliverys', DeliveryController.index);
routes.post('/deliverys', DeliveryController.store);
routes.put('/deliverys/:id', DeliveryController.update);
routes.delete('/deliverys/:id', DeliveryController.delete);

routes.get('/deliveryMan', DeliveryManController.index);
routes.post('/deliveryMan', DeliveryManController.store);
routes.put('/deliveryMan/:id', DeliveryManController.update);
routes.delete('/deliveryMan/:id', DeliveryManController.delete);

export default routes;
