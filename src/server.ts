import express from "express";
import K8sRouter from './routes/k8s.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/k8s', K8sRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello from Express and TypeScript!');
});