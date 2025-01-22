import { Request, Response } from "express";
import {
    getTests
} from "../services/user"


export async function GetTest(req: Request, res: Response): Promise<void> {
    try {
      const getTest = await getTests();
      res.status(200).json(getTest);
    } catch (error) {
      res
        .status(500)
        .json({
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }
  }
  
  