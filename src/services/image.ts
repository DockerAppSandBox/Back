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
            return await prisma.image.findMany();
        } catch (error) {
            throw new InternalServerError(
                `Failed to retrieve users: ${(error as Error).message}`
            );
        }
    }
}
