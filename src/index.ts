import express, { Express } from 'express';
import dotenv from 'dotenv';
import { Client } from './models/clientModel';
import mongoose from 'mongoose';
import { getClientRouter } from './routes/clientRouter';

dotenv.config();
const url = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/ubio';
mongoose.connect(url);

const app: Express = express();
const port = process.env.PORT || 3000;
const clientInactivityThreshold = Number(process.env.CLIENT_INACTIVITY_THRESHOLD_MS) || 60000;

app.use('', getClientRouter());

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

const checkClientInactivity = async () => {
  const currentThresholdTime = Date.now() - clientInactivityThreshold;
  await Client.deleteMany({
    updatedAt: { $lt: currentThresholdTime }
  }).exec();
}

setInterval(checkClientInactivity, clientInactivityThreshold / 2);
