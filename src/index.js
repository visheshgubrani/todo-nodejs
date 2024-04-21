import { app } from "./app.js";
import { dbClient } from "./db/dbClient.js";
import dotenv from 'dotenv'

dotenv.config()

dbClient().then(() => {
    const port = process.env.PORT || 6000
    app.listen(port, () => {
        console.log(`The Server is Running on ${port}`);
    })
}).catch((error) => {
    console.log(`The Server Failed to Run ${error}`);
})