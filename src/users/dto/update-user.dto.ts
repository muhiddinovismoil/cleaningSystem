import { createZodDto } from 'nestjs-zod';
import { UserSchema } from './create-user.dto';

export const UpdateUserSchema = UserSchema.partial();
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
