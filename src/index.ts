import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  // returns a JSON array containing a summary of all currently registered groups
  res.send('Express + TypeScript Server');
});

app.get('/:group', (req: Request, res: Response) => {
  // find group and return array describing instances of the group
  res.json();
});

app.put('/:group/:id', (req: Request, res: Response) => {

});

app.delete(':group/:id', (req: Request, res: Response) => {

});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

const checkClientInactivity = () => {
  const now = Date.now();

  // TODO foreach entry in database compare updatedAt with now and remove if higher than treshold
}

setInterval(checkClientInactivity, Number(process.env.CLIENT_INACTIVITY_TRESHOLD_MS));