import * as bcrypt from 'bcrypt';

export const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export const comparePasswords = (
  password: string,
  hashedPassword: string,
): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};
