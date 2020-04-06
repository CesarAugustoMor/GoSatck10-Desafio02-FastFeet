import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import FileController from './app/controllers/FileController';
import DeliverysController from './app/controllers/DeliverysController';

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

routes.get('/deliverys', DeliverysController.index);
routes.post('/deliverys', DeliverysController.store);
routes.put('/deliverys/:id', DeliverysController.update);
routes.delete('/deliverys/:id', DeliverysController.delete);

export default routes;
