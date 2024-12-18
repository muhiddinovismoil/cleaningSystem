import { createZodDto } from 'nestjs-zod';
import { Role } from 'src/enums/role.enums';
import { z } from 'zod';
export const UserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
  profile_logo: z.string().optional(),
  role: z.enum([Role.User, Role.Admin, Role.SuperAdmin]).optional(),
  isActive: z.boolean().optional(),
});
export class CreateAuthDto extends createZodDto(UserSchema) {}
export const AvatarSchema = z.object({
  profile_logo: z.string(),
});
export class AddAvatarDto extends createZodDto(AvatarSchema) {}
