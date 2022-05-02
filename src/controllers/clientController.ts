import { IClient } from '../interface/client.interface';
import { Client } from '../models/clientModel';
import { Request, Response } from 'express';
import { IGroupSummary } from '../interface/group-summary.interface';

export default class ClientController {
  static async put(req: Request, res: Response) {
    try {
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
        existingClient.updatedAt = client.updatedAt;
        await existingClient.save();
      }

      res.json(client)
    } catch {
      res.sendStatus(500);
    }

  }

  static async get(_req: Request, res: Response) {
    try {
      const groups = await Client.aggregate().group({
        _id: '$group',
        "instances": { "$sum": 1 },
        "createdAt": { "$min": "$createdAt" },
        "lastUpdatedAt": { "$max": "$updatedAt" },
      }).exec();
      res.json(groups.map(x => {
        const groupSummary: IGroupSummary = {
          group: x._id,
          instances: x.instances,
          createdAt: x.createdAt,
          lastUpdatedAt: x.lastUpdatedAt
        }
        return groupSummary;
      }));
    } catch {
      res.sendStatus(500);
    }
  }

  static async getGroup(req: Request, res: Response) {
    try {
      const existingClients = await Client.find({ group: req.params.group}).exec();

      const status = existingClients.length > 0 ? 200 : 204;
      res.status(status).json(existingClients);
    } catch {
      res.sendStatus(500);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await Client.deleteOne({  id: req.params.id, group: req.params.group }).exec();
      res.sendStatus(204);
    } catch {
      res.sendStatus(500);
    }
  }
}