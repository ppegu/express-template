import { type ExtraModel, MongooseExtras } from "@ppegu/mongoose-extras";
import moment from "moment";
import { Document, Schema, model } from "mongoose";
import { comparePassword, generatePassword } from "src/utils/hash.util";

export type UserDoc = {
  name: string;
  mobile: number;
  email: string;
  password: string;
  active: boolean;
  createdTimestamp: number;
  // eslint-disable-next-line no-unused-vars
  comparePassword: (password: string, hash: string) => Promise<boolean>;
} & Document;

const schema = new Schema<UserDoc>(
  {
    name: { type: String },
    mobile: { type: Number, required: true, unique: true },
    email: { type: String },
    password: { type: String },
    active: { type: Boolean, default: true },
    createdTimestamp: { type: Number, set: () => moment().unix() },
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log("pre save password");

  const hashPassword = await generatePassword(this.password);
  this.password = hashPassword;

  next();
});

schema.methods.comparePassword = comparePassword;

schema.plugin(MongooseExtras);

export default model("User", schema) as ExtraModel<UserDoc>;
