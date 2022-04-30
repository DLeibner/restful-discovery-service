import { Schema, model } from "mongoose";
import { IClient } from "../interface/client.interface";

const groupSchema = new Schema<IClient>({
  id: { type: String, required: true },
  group: { type: String, required: true },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
  meta: Object
})

export const Client = model<IClient>('Client', groupSchema);