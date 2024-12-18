import { createZodDto } from 'nestjs-zod';
import { RolesRes } from 'src/enums/employees.role.enums';
import { z } from 'zod';
export const RoleSchema = z.object({
  fullname: z.string(),
  responsible: z.enum([
    RolesRes.Admin,
    RolesRes.Manager,
    RolesRes.Cleaner,
    RolesRes.Owner,
  ]),
  description: z.string(),
  phone_number: z.string(),
});
export class CreateRoleDto extends createZodDto(RoleSchema) {}
