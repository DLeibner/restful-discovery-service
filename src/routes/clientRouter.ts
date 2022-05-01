import express from 'express';
import ClientController from '../controllers/clientController';

export const getClientRouter = () => {
  const router = express.Router();

  router.route('/').get(ClientController.get);

  router.route('/:group').get(ClientController.getGroup);

  router.route('/:group/:id')
    .put(ClientController.put)
    .delete(ClientController.delete);

  return router;
}