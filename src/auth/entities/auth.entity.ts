import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Default,
} from 'sequelize-typescript';
import { Role } from 'src/enums/role.enums';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  profile_logo: string;

  @Default(Role.User)
  @Column({
    type: DataType.ENUM(Role.User, Role.Admin, Role.SuperAdmin),
  })
  role: Role;
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
