import { NotFoundError, InternalServerError, BadRequestError } from "../http_code/error-code";
import { CreateImageVoteDTO, UpdateImageVoteDTO, ImageVote } from "../entity/imageVote";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isError(obj: unknown): obj is Error {
    return obj instanceof Error;
}

export default class ImageVoteService {

    // Obtenir toutes les images
    static async voteForImage(): Promise<Image[]> {
        try {
            // Vérifier si l'utilisateur a déjà voté pour cette image
            const existingVote = await prisma.imageVote.findUnique({
                where: {
                    userId_imageId: {
                        userId: data.userId,
                        imageId: data.imageId,
                    },
                },
            });

            if (existingVote) {
                // Si un vote existe déjà, on le met à jour
                return await prisma.imageVote.update({
                    where: {
                        userId_imageId: {
                            userId: data.userId,
                            imageId: data.imageId,
                        },
                    },
                    data: {
                        like: data.like, // Mettre à jour le vote
                    },
                });
            } else {
                // Sinon, créer un nouveau vote
                return await prisma.imageVote.create({
                    data: {
                        userId: data.userId,
                        imageId: data.imageId,
                        like: data.like,
                    },
                });
            }
        } catch (error) {
            throw new Error("Error voting for image.");
        }
    }

    static async getVotesByImageId(id: number): Promise<Image | null> {
        try {
            return await prisma.imageVote.findMany({
                where: {
                    imageId,
                },
            });
        } catch (error) {
            throw new Error("Error fetching votes for image.");
        }
    }
    static async updateVote(id: number, data: UpdateImageVoteDTO): Promise<Image> {
        try {
            return await prisma.imageVote.update({
                where: {
                    userId_imageId: {
                        userId,
                        imageId,
                    },
                },
                data: {
                    like: data.like, // Mettre à jour uniquement le champ "like"
                },
            });
        } catch (error) {
            throw new Error("Error updating vote.");
        }
    }

    static async deleteVote(id: number): Promise<void> {
        try {
            await prisma.imageVote.delete({
                where: {
                    userId_imageId: {
                        userId,
                        imageId,
                    },
                },
            });
        } catch (error) {
            throw new Error("Error deleting vote.");
        }
    }
}
