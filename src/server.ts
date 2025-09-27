import express from "express";

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello from Express and TypeScript!');
});