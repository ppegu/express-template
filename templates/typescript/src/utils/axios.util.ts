import { type AxiosResponse } from "axios";

export function isValidResponse(resp: AxiosResponse) {
  const contentType = resp.headers["content-type"];
  return contentType === "application/json";
}
