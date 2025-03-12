import express from 'express';
import userRoutes from './router/userRoutes.ts';

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!!`);
});
