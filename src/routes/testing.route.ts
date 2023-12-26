import {Router} from "express";
import {HTTP_RESPONSE_CODES, RequestType, ResponseType} from "../models/common";
import {TestingRepository} from "../repositories/testing-repository";

export const deleteAllDataRoute = Router({})

deleteAllDataRoute.delete('/all-data', async (req: RequestType, res: ResponseType<{}>) => {
    await TestingRepository.deleteAllData()

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})