import { NotFoundError, InternalServerError } from "../http_code/error-code"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function isError(obj: unknown): obj is Error {
  return obj instanceof Error;
}


export async function getTests(): Promise<string> {
    return "Hello, world!";
  }
  