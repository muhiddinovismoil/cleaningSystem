import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './auth.entity';
@Table({
  tableName: 'otp',
  timestamps: false,
})
export class OTP extends Model<OTP> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  otp_code: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;
}
