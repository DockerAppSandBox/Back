import express from 'express';
import ImageController from '../controllers/image';

const Router = express.Router();

Router.put("/:id", ImageController.getAllImages);
Router.delete("/:id", ImageController.deleteImage);
Router.post('/:id/like', ImageController.likeImage);
Router.post('/:id/dislike', ImageController.dislikeImage);

export default Router;