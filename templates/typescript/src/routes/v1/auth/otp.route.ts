import { Request, Response, Router } from "express";
import Device from "src/models/Device";
import Otp from "src/models/Otp";
import User from "src/models/User";
import { getDeviceinfo } from "src/utils/device.util";
import { comparePassword } from "src/utils/hash.util";
import { decodeToken, generateToken } from "src/utils/jwt.util";
import { asyncRes } from "src/utils/resp.util";
import { validate } from "src/utils/validate.util";
import schema from "./schema";

const router = Router();

/**
 * @api {post} /v1/auth/otp/send-otp Send Otp
 * @apiGroup Auth
 * @apiDescription Send Otp
 * @apiBody {String} mobile Required
 * @apiSuccess (200) {Boolean} success true
 * @apiSuccess (200) {String} message success message
 * @apiSuccess (200) {Object} data data
 * @apiError (400) {Boolean} success false
 * @apiError (400) {String}  message error.message
 * @apiError (400) {Object}  error error
 */

router.post(
  "/send-otp",
  validate(schema.sendOtp),
  asyncRes(async (req, res) => {
    console.log("sending OTP..");
    const otp = await Otp.create({ identifier: req.body.mobile });
    console.log("OTP sent.");
    res.success(
      {
        authToken: await generateToken({ id: otp.id }),
      },
      "OTP sent",
    );
  }),
);

/**
 * @api {post} /v1/auth/otp/login Otp Login
 * @apiGroup Auth
 * @apiDescription Otp Login
 * @apiBody {String} email Required
 * @apiBody {String} password Required
 * @apiSuccess (200) {Boolean} success true
 * @apiSuccess (200) {String} message success message
 * @apiSuccess (200) {Object} data data
 * @apiError (400) {Boolean} success false
 * @apiError (400) {String}  message error.message
 * @apiError (400) {Object}  error error
 */

router.post(
  "/login",
  validate(schema.login),
  asyncRes(async (req: Request, res: Response) => {
    let token = req.headers.Authorization || req.headers.authorization;

    if (!token) return res.unauth();
    if (!String(token).startsWith("Bearer ")) return res.unauth();

    token = String(token).substring(7, token.length);

    const otpSession = await decodeToken(token);

    const otpDoc = await Otp.findById(otpSession?.id);

    if (!otpDoc) return res.error("invalid session");

    if (req.body.referrerId) {
      const referrer = await User.findOne({ referrerId: req.body.referrerId });
      if (!referrer) return res.error("Invalid referrerId");
    }

    const isSameOtp = await comparePassword(req.body.otp, otpDoc.otp);

    if (!isSameOtp) return res.error("Invalid OTP");

    const user = await User.findOneOrCreate({
      mobile: otpDoc.identifier,
    });

    if (!user) return res.error("Woops something went wrong");

    const device = await Device.findOneOrCreate({
      user: user.id,
      ...getDeviceinfo(req.body),
      active: true,
    });

    res.success({
      authToken: await generateToken({ id: user.id, deviceId: device.id }),
    });
  }),
);

export default router;
