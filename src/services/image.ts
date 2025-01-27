import { NotFoundError, InternalServerError } from "../http_code/error-code";
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
            const images = await prisma.image.findMany({
              orderBy: { createdAt: "desc" },
            });
      
            return images;
          } catch (error) {
            console.error("Error fetching images:", error);
            throw new InternalServerError(
              `Failed to retrieve images: ${(error as Error).message}`
            );
          }
        }

    static async getImageById(id: string): Promise<Image | null> {
        try {
            const image = await prisma.image.findUnique({ where: { id } });
            if (!image) {
                throw new NotFoundError(`Image with ID ${id} not found`);
            }
            return image;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(`Image with ID ${id} not found`);
            }
            throw new InternalServerError(
                `Failed to retrieve image: ${(error as Error).message}`
            );
        }
    }

    static async createImage(imageUrl: string): Promise<Image> {
        try {
            const image = await prisma.image.create({
                data: {
                    imageUrl: imageUrl,
                },
            });
            return image;
        } catch (error) {
            throw new InternalServerError(
                error instanceof Error ? error.message : "Unknown error while creating image"
            );
        }
    }

    static async updateImage(id: string, data: UpdateImageDTO): Promise<Image> {
        try {
            const existingImage = await this.getImageById(id);

            if (!existingImage) {
                throw new NotFoundError(`Image with ID ${id} not found`);
            }

            const image = await prisma.image.update({
                where: { id },
                data: {
                    ...data,
                    imageUrl: data.imageData || undefined,
                },
            });
            return image;
        } catch (error) {
            throw new InternalServerError(
                isError(error) ? error.message : "Unknown error while updating image"
            );
        }
    }

    static async deleteImage(id: string): Promise<string> {
        try {
            const existingImage = await this.getImageById(id);

            if (!existingImage) {
                throw new NotFoundError(`Image with ID ${id} not found`);
            }
            await prisma.image.delete({ where: { id } });
            return `Image with ID ${id} deleted successfully`;
        } catch (error) {
            throw new InternalServerError(
                isError(error) ? error.message : "Unknown error while deleting image"
            );
        }
    }

    // Méthode pour liker une image
    static async likeImage(id: string): Promise<Image> {
        try {
            const existingImage = await this.getImageById(id);

            if (!existingImage) {
                throw new NotFoundError(`Image with ID ${id} not found`);
            }

            const image = await prisma.image.update({
                where: { id },
                data: {
                    likesCount: {
                        increment: 1,
                    },
                },
            });
            return image;
        } catch (error) {

            throw new InternalServerError(
                error instanceof Error ? error.message : "Unknown error while add a like"
            );
        }
    }

    // Méthode pour disliker une image
    static async dislikeImage(id: string): Promise<Image> {
        try {
            const existingImage = await this.getImageById(id);

            if (!existingImage) {
                throw new NotFoundError(`Image with ID ${id} not found`);
            }

            const image = await prisma.image.update({
                where: { id },
                data: {
                    likesCount: {
                        decrement: 1,
                    },
                },
            });
            return image;
        } catch (error) {
            throw new InternalServerError(
                error instanceof Error ? error.message : "Unknown error while add a like"
            );
        }
    }

}
