import bcrypt from 'bcrypt';

type HashPasswordParams = {
  password: string;
};

type ComparePasswordParams = {
  password: string;
  encryptedPassword: string;
};

export const hashPassword = async ({ password }: HashPasswordParams): Promise<string> => {
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

export const comparePassword = async ({ password, encryptedPassword }: ComparePasswordParams): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, encryptedPassword);
  return isMatch;
};
