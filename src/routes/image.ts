import express from 'express';
import ImageController from '../controllers/image';

const Router = express.Router();

// Router.put("/:id", ImageController.getAllImages);
// Router.delete("/:id", ImageController.deleteImage);
Router.post('/:id/dislike', ImageController.dislikeImage);

Router.get("/", ImageController.getAllImages)
Router.post("/", ImageController.createImage)
// Router.post('/:id/like', ImageController.likeImage);

export default Router;