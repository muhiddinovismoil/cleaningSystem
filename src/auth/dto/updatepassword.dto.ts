import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
export const updatePassSchema = z.object({
  email: z.string().email(),
  oldPassword: z.string(),
  password: z.string(),
});
export class UpdatePasswordDto extends createZodDto(updatePassSchema) {}
export const forgetPassSchem = z.object({
  email: z.string().email(),
  otp_code: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});
export class ForgetPasswordDto extends createZodDto(forgetPassSchem) {}
