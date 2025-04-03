// backend/src/models/Address.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { fixCityState, fixPort } from '../utils/getInfo';
import { AddressAttributes, AddressCreationAttributes, AddressEnum, PortEnum } from '@ddlabel/shared';
import { User } from './User';
import { Package } from './Package';

class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public name!: string;
  public address1!: string;
  public address2?: string;
  public city!: string;
  public state!: string;
  public zip!: string;
  public proposal?: PortEnum;
  public sortCode?: string;
  public email?: string;
  public phone?: string;
  public addressType!: AddressEnum;

  public userId?: number;
  public fromPackageId?: number;
  public toPackageId?: number;

  public user!: User;
  public fromPackage!: Package;
  public toPackage!: Package;

  public static async createWithInfo(attr: AddressCreationAttributes): Promise<AddressCreationAttributes> {
    attr = await fixCityState(attr);
    attr = await fixPort(attr);
    return await Address.create(attr);
  }

  public static async updateWithInfo(attr: AddressAttributes): Promise<void> {
    attr = await fixCityState(attr);
    attr = await fixPort(attr);
    await Address.update(attr,  { where: { id: attr.id } });
  }


  public static async bulkCreateWithInfo(attrs: AddressCreationAttributes[]) {
    const fixedAttrs = await Promise.all(attrs.map(async (attr) => await fixCityState(attr))); 
    await Address.bulkCreate(fixedAttrs);
  }
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    addressType: {
      type: DataTypes.ENUM('user', 'package'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proposal: { 
      type: DataTypes.ENUM('LAX', 'JFK', 'ORD', 'SFO', 'DFW', 'MIA', 'ATL', 'BOS', 'SEA'),
      allowNull: true,
    },
    sortCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    fromPackageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Package,
        key: 'id',
      },
    },
    toPackageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Package,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'addresses',
    timestamps: true,
  }
);


export { Address, AddressCreationAttributes };
