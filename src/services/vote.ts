import { NotFoundError, InternalServerError } from "../http_code/error-code";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isError(obj: unknown): obj is Error {
    return obj instanceof Error;
}

export default class VoteService{

    static async CreateVote(like: boolean, imageId: string, userId: string){
        try {
            const newVote = await prisma.imageVote.create({
                data:{
                    userId,
                    imageId,
                    like
                }
            })
            return newVote
        } catch (error) {
            throw new InternalServerError("failed to create")
        }
    }

    static async UpdateVote(like: boolean, imageId: string, userId: string){
        try {
            const updatedVote = await prisma.imageVote.update({
                where: {
                  userId_imageId: {
                    userId,
                    imageId,
                  },
                },
                data: {
                  like: like,
                },
              });
        
              return updatedVote;
        } catch (error) {
            throw new InternalServerError("failed to create")
        }
    }

    static async DeleteVote(imageId: string, userId: string){
        try {
            await prisma.imageVote.delete({
              where: {
                userId_imageId: {
                  userId,
                  imageId,
                },
              },
            });
            return { message: "Vote deleted successfully" };
          } catch (error) {
            console.error("Error deleting vote:", error);
            throw new InternalServerError("Failed to delete vote");
          }
    }

    static async GetAllMyVote(userId: string){
      try {
        const votes = await prisma.imageVote.findMany({
            where: { userId },
            select: {
                imageId: true,
                image: {
                    select: {
                        id: true,
                        imageUrl: true,
                        likesCount: true,
                    },
                },
            },
        });

        return votes.map(vote => ({
            id: vote.imageId,
            imageUrl: vote.image.imageUrl,
            likesCount: vote.image.likesCount,
        }));
    } catch (error) {
        console.error("Error retrieving user votes: ", error);
        throw new InternalServerError("Failed to retrieve votes");
    }
  }



}