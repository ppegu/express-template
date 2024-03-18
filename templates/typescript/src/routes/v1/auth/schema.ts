import * as yup from "yup";

export const deviceSchema = {
  deviceName: yup.string().required("missing somethign!!"),
  deviceUuid: yup.string().required("missing somethign!!"),
  deviceOs: yup.string().required("missing somethign!!"),
};

export default {
  sendOtp: yup.object().shape({
    mobile: yup.string().required("mobile is required."),
    ...deviceSchema,
  }),
  login: yup.object().shape({
    mobile: yup.string().required("username is required."),
    otp: yup.string().required("otp is required."),
    ...deviceSchema,
  }),
};
