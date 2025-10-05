import crypto from "crypto";

export const hashPassword = (password: string, salt: string) => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) {
        return reject(error);
      } else {
        resolve(hash.toString("hex").normalize());
      }
    });
  });
};

export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex").normalize();
};

export const comparePasswords = async (signedInPassword: string, salt: string, dbHashedPassword: string) => {
  const signedInHashedPassword: string = (await hashPassword(signedInPassword, salt)) as string;
  return crypto.timingSafeEqual(Buffer.from(signedInHashedPassword, "hex"), Buffer.from(dbHashedPassword, "hex"));
};
