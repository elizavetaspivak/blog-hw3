import {runDb} from "./db/db";
import dotenv from 'dotenv'
import {app} from "./settings";

dotenv.config()

const port = process.env.PORT || 80

app.listen(port, async () => {
    await runDb(+port)
})