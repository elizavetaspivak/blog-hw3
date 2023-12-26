import {db} from "../db/db";
import {Router} from "express";
import {HTTP_RESPONSE_CODES, RequestType, ResponseType} from "../models/common";

export const deleteAllDataRoute = Router({})

deleteAllDataRoute.delete('/', (req: RequestType, res: ResponseType<{}>) => {
    db.blogs = []
    db.posts = []

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})