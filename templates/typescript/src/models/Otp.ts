import { type ExtraModel, MongooseExtras } from "@ppegu/mongoose-extras";
import { Document, Schema, model } from "mongoose";
import hidden from "mongoose-hidden";
import { generatePassword } from "src/utils/hash.util";

export type OtpDoc = Document & {
  identifier: string;
  type: "mobile" | "email";
  otp: string;
  expireIn: number;
  used: false | boolean;
};

const schema = new Schema<OtpDoc>(
  {
    identifier: { type: String, required: true }, //mobile/email
    type: { type: String, enum: ["mobile", "email"], default: "mobile" },
    otp: { type: String, required: true },
    expireIn: { type: Number, default: 60 * 60000 }, //1hour (ms)
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**hash the password */
schema.pre("validate", async function (next) {
  const newOtp = "123456";
  this.otp = await generatePassword(newOtp);
  next();
});

schema.plugin(hidden(), { _hidden: { _id: false, otp: true } });

schema.plugin(MongooseExtras);

export default model("Otp", schema) as ExtraModel<OtpDoc>;
