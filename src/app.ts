import express from 'express';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.listen(PORT);
