import { NotFoundError, InternalServerError, BadRequestError } from "../http_code/error-code";
import { CreateImageVoteDTO, UpdateImageVoteDTO, ImageVote } from "../entity/imageVote";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isError(obj: unknown): obj is Error {
    return obj instanceof Error;
}

export default class ImageVoteService {

    // Obtenir toutes les images
    static async voteForImage(data: CreateImageVoteDTO): Promise<ImageVote> {
        try {
            const existingVote = await prisma.imageVote.findUnique({
                where: {
                    userId_imageId: {
                        userId: data.userId,
                        imageId: data.imageId,
                    },
                },
            });

            if (existingVote) {
                if (existingVote.like === data.like) {
                    // Si le vote existe déjà et est identique, renvoyer une erreur
                    throw new Error(
                        `You have already ${data.like ? "liked" : "disliked"} this image.`
                    );
                }

                // Mettre à jour le vote si la valeur est différente
                return await prisma.imageVote.update({
                    where: {
                        userId_imageId: {
                            userId: data.userId,
                            imageId: data.imageId,
                        },
                    },
                    data: {
                        like: data.like,
                    },
                });
            } else {
                // Créer un nouveau vote
                return await prisma.imageVote.create({
                    data: {
                        userId: data.userId,
                        imageId: data.imageId,
                        like: data.like,
                    },
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerError(error.message);
            }
            throw new InternalServerError("Error voting for image.");
        }
    }

    static async getVotesByImageId(imageId: number): Promise<ImageVote[]> {
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

    static async updateVote(data: UpdateImageVoteDTO): Promise<ImageVote> {
        try {
            const updatedVote = await prisma.imageVote.update({
                where: {
                    userId_imageId: {
                        userId: data.userId,
                        imageId: data.imageId,
                    },
                },
                data: {
                    like: data.like,
                },
            });

            return updatedVote;
        } catch (error: any) {
            if (error.code === "P2025") {
                // Gérer les cas où le vote n'existe pas
                throw new Error("Vote not found.");
            }
            throw new InternalServerError("Error updating vote.");
        }
    }

    static async deleteVote(userId: string, imageId: number): Promise<void> {
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

    static async getVote(userId: string, imageId: number): Promise<ImageVote | null> {
        try {
            return await prisma.imageVote.findUnique({
                where: {
                    userId_imageId: { userId, imageId }, // Si vous avez défini une clé unique dans Prisma
                },
            });
        } catch (error) {
            throw new InternalServerError("Error fetching vote.");
        }
    }
}
