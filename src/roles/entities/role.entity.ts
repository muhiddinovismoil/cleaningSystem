import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { RolesRes } from 'src/enums/employees.role.enums';
@Table({ tableName: 'roles' })
export class Roles extends Model<Roles> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullname: string;

  @Column({
    type: DataType.ENUM(
      RolesRes.Admin,
      RolesRes.Manager,
      RolesRes.Cleaner,
      RolesRes.Owner,
    ),
    allowNull: true,
    defaultValue: RolesRes.Cleaner,
  })
  responsible: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone_number: string;
}
