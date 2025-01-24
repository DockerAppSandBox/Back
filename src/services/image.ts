import { NotFoundError, InternalServerError, BadRequestError } from "../http_code/error-code";
import { Image, CreateImageDTO, UpdateImageDTO } from "../entity/image";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isError(obj: unknown): obj is Error {
    return obj instanceof Error;
}

export default class ImageService {

    // Obtenir toutes les images
    static async getAllImages(): Promise<Image[]> {
        try {
            const images = await prisma.image.findMany();
            const formattedImages = images.map(image => ({
                ...image,
                imageData: Buffer.from(image.imageData), // Conversion ici
            }));
            return formattedImages;
        } catch (error) {
            throw new Error('Error fetching images.');
        }
    }

    static async getImageById(id: number): Promise<Image | null> {
        try {
            const image = await prisma.image.findUnique({ where: { id } });
            if (!image) {
                throw new Error('Image not found.');
            }
            return {
                ...image,
                imageData: Buffer.from(image.imageData),
            };
        } catch (error) {
            throw new Error('Error fetching image.');
        }
    }

    static async createImage(data: CreateImageDTO): Promise<Image> {
        try {
            const createdImage = await prisma.image.create({
                data: {
                    ...data,
                    imageData: Buffer.from(data.imageData),
                },
            });
            return {
                ...createdImage,
                imageData: Buffer.from(createdImage.imageData),
            };
        } catch (error) {
            throw new Error('Error creating image.');
        }
    }

    static async updateImage(id: number, data: UpdateImageDTO): Promise<Image> {
        try {
            const updatedImage = await prisma.image.update({
                where: { id },
                data,
            });
            return {
                ...updatedImage,
                imageData: Buffer.from(updatedImage.imageData),
            };
        } catch (error) {
            throw new Error('Error updating image.');
        }
    }

    static async deleteImage(id: number): Promise<void> {
        try {
            await prisma.image.delete({ where: { id } });
        } catch (error) {
            throw new Error('Error deleting image.');
        }
    }

    // Méthode pour liker une image
    static async likeImage(id: number): Promise<Image> {
        try {
            const updatedImage = await prisma.image.update({
                where: { id },
                data: {
                    likesCount: {
                        increment: 1
                    }
                }
            });
            return {
                ...updatedImage,
                imageData: Buffer.from(updatedImage.imageData),
            };
        } catch (error) {
            throw new Error('Error liking image.');
        }
    }

    // Méthode pour disliker une image
    static async dislikeImage(id: number): Promise<Image> {
        try {
            const updatedImage = await prisma.image.update({
                where: { id },
                data: {
                    dislikesCount: {
                        increment: 1
                    }
                }
            });
            return {
                ...updatedImage,
                imageData: Buffer.from(updatedImage.imageData),
            };
        } catch (error) {
            throw new Error('Error disliking image.');
        }
    }
}
