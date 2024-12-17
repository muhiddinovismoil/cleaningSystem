import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/enums/role.enums';
export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop()
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  profile_logo: string;
  @Prop({ enum: [Role.User, Role.Admin, Role.SuperAdmin], default: Role.User })
  role: Role;
  @Prop({ type: Boolean, default: false })
  isActive: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
