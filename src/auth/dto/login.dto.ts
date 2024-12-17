import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
export const AuthSchema2 = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class LoginAuthDto extends createZodDto(AuthSchema2) {}
