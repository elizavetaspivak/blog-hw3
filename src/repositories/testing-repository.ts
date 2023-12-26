import {database} from "../db/db";

export class TestingRepository {
    static async deleteAllData() {
        await database.dropDatabase({})
    }
}