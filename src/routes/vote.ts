import express from 'express';
import VoteController from '../controllers/vote';

const Router = express.Router();

// CreateVote / UpdateVote / RemoveVote / GetAllMyVote 

Router.post("/", VoteController.CreateVote)
// Router.patch("/:id", VoteController.UpdateVote)
Router.delete("/:id", VoteController.DeleteVote)
Router.get("/user", VoteController.GetAllMyVote)

export default Router;