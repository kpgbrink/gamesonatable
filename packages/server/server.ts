import express from 'express';
import { QueryPayLoad } from 'api';
const app = express();
const port = 3001;

app.get("/data", (req, res) => {

    const data: QueryPayLoad = { foo: "bar" };

    res.json({ foo: "bar" });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});