import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type OtpDocument = HydratedDocument<OTP>;
@Schema()
export class OTP {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  user_id: string;
  @Prop({ unique: true })
  otp_code: string;
  @Prop({ default: Date.now, expires: 300 })
  createdAt: Date;
}
export const OtpSchema = SchemaFactory.createForClass(OTP);
