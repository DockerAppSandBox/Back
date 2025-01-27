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
                    throw new BadRequestError(
                        `You have already ${data.like ? "liked" : "disliked"} this image.`
                    );
                }
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
                return await prisma.imageVote.create({
                    data: {
                        userId: data.userId,
                        imageId: data.imageId,
                        like: data.like,
                    },
                });
            }
        } catch (error) {
            throw new InternalServerError(
                error instanceof Error ? error.message : "Unknown error while  voting for image"
            );
        }
    }

    static async getVotesByImageId(imageId: string): Promise<ImageVote[]> {
        try {
            return await prisma.imageVote.findMany({
                where: {
                    imageId,
                },
            });
        } catch (error) {
            throw new InternalServerError(
                error instanceof Error ? error.message : "Unknown error while  fetching votes for image"
            );
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
                throw new NotFoundError("Vote not found.");
            }
            throw new InternalServerError("Error updating vote.");
        }
    }

    static async deleteVote(userId: string, imageId: string): Promise<void> {
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
            throw new InternalServerError("Error deleting vote.");
        }
    }

    static async getVote(userId: string, imageId: string): Promise<ImageVote | null> {
        try {
            return await prisma.imageVote.findUnique({
                where: {
                    userId_imageId: { userId, imageId },
                },
            });
        } catch (error) {
            throw new InternalServerError("Error fetching vote.");
        }
    }
}
