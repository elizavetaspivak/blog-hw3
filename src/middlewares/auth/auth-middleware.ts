import {NextFunction, Request} from "express";
import dotenv from 'dotenv';
import {HTTP_RESPONSE_CODES, ResponseType} from "../../models/common";

dotenv.config()

export const authMiddleware = (req: Request, res: ResponseType<void>, next: NextFunction) => {
    const auth = req.headers['authorization']

    if (auth === 'undefined' || !auth) {
        res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED)
        return
    }

    const [basic, token] = auth!.split(" ")

    if (basic !== 'Basic') {
        res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED)
        return
    }

    const decodedData = Buffer.from(token, 'base64').toString()

    const [login, password] = decodedData.split(":")

    if (login !== process.env.LOGIN || password !== process.env.PASSWORD) {
        res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED)
        return
    }

    return next()
}