import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Client } from './models/clientModel';
import mongoose from 'mongoose';
import { IClient } from './interface/client.interface';
import { IGroupSummary } from './interface/group-summary.interface';

dotenv.config();
const url = 'mongodb://127.0.0.1:27017/ubio'
mongoose.connect(url);

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', async (_req: Request, res: Response) => {
  const groups = await Client.aggregate().group({
    _id: '$group',
    "instances": { "$sum": 1 },
    "createdAt": { "$min": "$createdAt" },
    "lastUpdatedAt": { "$max": "$updatedAt" },
  });
  res.json(groups.map(x => {
    const groupSummary: IGroupSummary = {
      group: x._id,
      instances: x.instances,
      createdAt: x.createdAt,
      lastUpdatedAt: x.lastUpdatedAt
    }
    return groupSummary;
  }));
});

app.get('/:group', async (req: Request, res: Response) => {
  const existingClients = await Client.find({ group: req.params.group}).exec();

  if (!existingClients) {
    res.status(204).json(existingClients);
    return;
  }
  
  res.json(existingClients);
});

app.put('/:group/:id', async (req: Request, res: Response) => {
  const existingClient = await Client.findOne({ id: req.params.id, group: req.params.group }).exec();

  const client: IClient = {
    id: req.params.id,
    group: req.params.group,
    createdAt: existingClient ? existingClient.createdAt : Date.now(),
    updatedAt: Date.now(),
    meta: req.body
  }

  if (!existingClient) {
    const newClient = new Client(client);
    await newClient.save();
  } else {
    existingClient.update({...client});
  }

  res.json(client)
});

app.delete('/:group/:id', async (req: Request, res: Response) => {
  await Client.deleteOne({  id: req.params.id, group: req.params.group });

  res.status(204);
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

const checkClientInactivity = () => {
  const now = Date.now();

  // TODO foreach entry in database compare updatedAt with now and remove if higher than treshold
}

setInterval(checkClientInactivity, Number(process.env.CLIENT_INACTIVITY_TRESHOLD_MS));
