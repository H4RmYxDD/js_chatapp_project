import express from 'express';
import usersRoutes from './routers/usersRoutes.js';
import messagesRoutes from './routers/messagesRoutes.js';
import cors from 'cors';
import "dotenv/config";
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});