import { type ExtraModel, MongooseExtras } from "@ppegu/mongoose-extras";
import { Document, Schema, model } from "mongoose";
import type { UserDoc } from "./User";

export type DeviceDoc = Document & {
  user: UserDoc;
  name: string;
  uuid: string;
  manufacturer: string;
  version: string | undefined;
  os: "android" | "ios" | "web";
  active: true | boolean;
};

const schema = new Schema<DeviceDoc>(
  {
    user: { type: Schema.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    uuid: { type: String, required: true },
    manufacturer: { type: String },
    version: { type: String },
    os: { type: String, enum: ["android", "ios", "web"], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  if (!this.isNew) return next();
  /**
   * check if any same device is active
   * deactive it
   */
  const devices: DeviceDoc[] = await this.$model("Device").find({
    user: this.user,
    active: true,
  });

  const ids = [];

  for (const device of devices) {
    if (device.os !== this.os) continue;
    ids.push(device._id);
  }

  await this.$model("Device").updateMany(
    { id: { $in: ids } },
    { active: false }
  );

  next();
});

schema.plugin(MongooseExtras);

export default model("Device", schema) as ExtraModel<DeviceDoc>;
