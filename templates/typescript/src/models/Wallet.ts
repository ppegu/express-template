import { type ExtraModel, MongooseExtras } from "@ppegu/mongoose-extras";
import { Document, model, Schema } from "mongoose";
import hidden from "mongoose-hidden";
import type { UserDoc } from "./User";

export type WalletDoc = {
  user: UserDoc;
  balance: number;
  holdBalance: number;
  commissions: number;
  interests: number;
} & Document;

const schema = new Schema<WalletDoc>(
  {
    user: { type: Schema.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0 },
    holdBalance: { type: Number, default: 0 },
    commissions: { type: Number, default: 0 },
    interests: { type: Number, default: 0 },
  },
  { timestamps: true }
);

schema.plugin(hidden(), { hidden: { _id: false } });

schema.plugin(MongooseExtras);

export default model("Wallet", schema) as ExtraModel<WalletDoc>;
