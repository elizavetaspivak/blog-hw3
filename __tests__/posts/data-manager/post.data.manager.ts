import request from "supertest";
import {Express} from "express";
import {app} from "../../../src/settings";
import dotenv from "dotenv";
import {ErrorType} from "../../../src/models/common";
import {PossibleErrors} from "../posts.e2e.test";

dotenv.config()

export class PostDataManager {

    private readonly basePath = '/posts'
    private readonly deletePath = '/testing/all-data'

    constructor(private readonly app: Express) {
    }

    prepareAuth(): { login: string, password: string } {
        return {login: process.env.LOGIN!, password: process.env.PASSWORD!}
    }

    async getByIdAndExpectCode(id: string, expectedCode: number = 200) {
        const post = await request(this.app)
            .get(this.basePath + '/' + id)
            .expect(expectedCode)

        return post.body
    }

    async deleteAllDataAndExpectCode(authData: {
        login: string,
        password: string
    }, expectedCode: number = 204) {
        await request(this.app)
            .delete(this.deletePath)
            .auth(authData.login, authData.password)
            .expect(expectedCode)
    }

    async createNewPostAndExpectCode<D extends object>(authData: {
        login: string,
        password: string
    }, createData: D, expectedCode: number = 201) {
        const res = await request(this.app)
            .post(this.basePath)
            .auth(authData.login, authData.password)
            .send(createData)
            .expect(expectedCode)

        return res.body;
    }

    async updateNewPostAndExpectCode<D extends object>(authData: {
        login: string,
        password: string
    }, id: string, updateData: D, expectedCode: number = 204) {
        const res = await request(this.app)
            .put(this.basePath + '/' + id)
            .auth(authData.login, authData.password)
            .send(updateData)
            .expect(expectedCode)

        return res.body;
    }

    async deletePostAndExpectCode(authData: {
        login: string,
        password: string
    }, id: string, expectedCode: number = 204) {
        const res = await request(this.app)
            .delete(this.basePath + '/' + id)
            .auth(authData.login, authData.password)
            .expect(expectedCode)

        return res.body;
    }

    async reRequestPosts(expectedCode: number = 200) {
        const res = await request(app).get(this.basePath).expect(expectedCode);

        return res.body;
    }

    expectBody<D>(data: D, expectedData: D) {
        expect(data).toEqual(expectedData)
    }

    expectBodyLength<D extends Array<any>>(data: Array<D>, expectedDataLength: number) {
        expect(data.length).toEqual(expectedDataLength)
    }

    prepareErrorsByKeys(keys: PossibleErrors[]) {
        const errors: ErrorType = {
            errorsMessages: []
        }

        keys.forEach(key => {
            errors.errorsMessages.push({message: `Incorrect ${key}`, field: key})
        })

        return errors
    }
}