import { Request, response, Response } from 'express';
import UserService from "../services/user";
import {
    NotFoundError,
    InternalServerError,
    BadRequestError,
  } from "../http_code/error-code";
import verifyToken from "../middleware/auth";
import VoteService from '../services/vote';
import ImageService from '../services/image';
import { log } from 'console';



export default class VoteController {

    static async CreateVote(
        req: Request<{},{},{like:boolean, imageId: string}>,
        res: Response
    ){
        const {like, imageId} = req.body
        verifyToken(req,res, async()=>{
            if(like === null || like === undefined){
                return res.status(500).json({error: 'vous devez avoir un vote'})
            }
            if(!imageId){
                return res.status(500).json({error: 'vous devez avoir une image a voter'})
            }
            const userId = req.user?.id as string;
            try {
                const vote = await VoteService.CreateVote(like, imageId, userId)
                await ImageService.likeImage(imageId)
                return res.status(201).json(vote)
            } catch (error) {
                if(error instanceof InternalServerError){
                    return res.status(error.statusCode).json({error: error.message})
                }else{
                    return res.status(500).json({error: "unknown error"})
                }
            }

        })
        

    }

    static async UpdateVote(
        req: Request<{id:string},{},{like:boolean}>,
        res: Response
    ){
        const {like} = req.body
        const imageId = req.params.id
        verifyToken(req,res, async()=>{
            if(!like){
                return res.status(500).json({error: 'vous devez avoir un vote'})
            }
            const userId = req.user?.id as string;
            try {
                const vote = await VoteService.UpdateVote(like, imageId, userId)
                return res.status(201).json(vote)
            } catch (error) {
                log(error,' l erreur ')
                if(error instanceof InternalServerError){
                    return res.status(error.statusCode).json({error: error.message})
                }else{
                    return res.status(500).json({error: "unknown error"})
                }
            }

        })
    }

    static async DeleteVote(
        req: Request,
        res: Response
    ){
        verifyToken(req,res, async()=>{
            const userId = req.user?.id as string;
            const imageId = req.params.id

            try {
                const response = await VoteService.DeleteVote(imageId, userId)
                await ImageService.dislikeImage(imageId)
                res.status(200).json(response)

            } catch (error) {
                log(error,' l erreur ')
                if(error instanceof InternalServerError){
                    return res.status(error.statusCode).json({error: error.message})
                }else{
                    return res.status(500).json({error: "unknown error"})
                }
            }

        })

    }

    static async GetAllMyVote(
        req: Request,
        res: Response
    ){
        verifyToken(req,res, async()=>{
            const userId = req.user?.id as string;

            try {
                const response = await VoteService.GetAllMyVote(userId)
                res.status(200).json(response)
            } catch (error) {
                log(error,' l erreur ')
                if(error instanceof InternalServerError){
                    return res.status(error.statusCode).json({error: error.message})
                }else{
                    return res.status(500).json({error: "unknown error"})
                }
            }

        })

    }

}