import * as bcrypt from 'bcrypt';
export async function generateHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
export async function comparePass(oldPassword: string, password: string) {
  return await bcrypt.compare(password, oldPassword);
}
