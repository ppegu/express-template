import { verify } from "jsonwebtoken";

// const bcrypt = require("bcryptjs");

// export const generatePassword = (password: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     bcrypt.genSalt(10, (error, salt) => {
//       if (error) return reject(error);
//       bcrypt.hash(password, salt, (error, hash) => {
//         if (error) return reject(error);
//         resolve(hash);
//       });
//     });
//   });
// };

export async function generatePassword(password: string) {
  const hash = await Bun.password.hash(password);
  return hash;
}

// export function comparePassword(
//   password: string,
//   hash: string
// ): Promise<boolean> {
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(password, hash, (error, valid) => {
//       if (error) return reject(error);
//       resolve(valid);
//     });
//   });
// }

export async function comparePassword(password: string, hash: string) {
  const isMatch = await Bun.password.verify(password, hash);
  return isMatch;
}

export const generateRandomString = (length = 12): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJ0123456789KLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrs0123456789tuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function decodeHash(hash: string, secret: string) {
  const decoded = verify(hash, secret);
  return decoded;
}

export function isValidJSON(jsonString: string) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

export function sleep(duration: number): Promise<void> {
  console.log("sleeing", duration, "ms");
  return new Promise((rs) => setTimeout(rs, duration));
}
