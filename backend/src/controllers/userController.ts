// backend/src/controllers/userController.ts
import { NextFunction, Request } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Address } from '../models/Address';
import { AuthRequest } from '../types';
import {
  AddressEnum,
  GetUserRes,
  GetUsersRes,
  LoginUserRes,
  RegisterUserReq,
  RegisterUserRes,
  ResponseAdv,
  SimpleRes,
  UpdateUserRes,
  UpdateUserReq,
} from '@ddlabel/shared';
import { resHeaderError } from '../utils/errors';
import { Transaction } from '../models/Transaction';
import { Package } from '../models/Package';
import { getAddressesWhere, getQueryWhere } from './packageControllerUtil';
import { InvalidCredentialsError, NotFoundError } from '../utils/errorClasses';

export const registerUser = async (req: Request, res: ResponseAdv<RegisterUserRes>, next: NextFunction) => {
  const { name, email, password, role, warehouseAddress }: RegisterUserReq = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword, role });
    warehouseAddress.userId = user.id;
    await Address.createWithInfo(warehouseAddress);
    return res.status(201).json({ success: true, userId: user.id });
  } catch (error: any) {
    return resHeaderError('registerUser', error, req.body, res, next);
  }
};

export const loginUser = async (req: AuthRequest, res: ResponseAdv<LoginUserRes>, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError(`User not found - ${email}`);
    }
    
    if (!await bcrypt.compare(password, user.password)) {
      throw new InvalidCredentialsError(`Invalid credentials - ${email}`);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return res.json({ token, userId: user.id, userRole: user.role });
  } catch (error: any) {
    return resHeaderError('loginUser', error, req.body, res, next);
  }
};

export const updateUserById = async (req: AuthRequest, res: ResponseAdv<UpdateUserRes>, next: NextFunction) => {
  const user = req.body as UpdateUserReq & { id: number };
  try {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    } else {
      delete user.password;
    }

    await Address.updateWithInfo(user.warehouseAddress);
    const [affectedCount]: [affectedCount: number] = await User.update(user, { where: { id: user.id } });
    const result: UpdateUserRes = { success: affectedCount > 0 };

    return res.json(result);
  } catch (error: any) {
    return resHeaderError('updateUserById', error, req.body, res, next);
  }
};

export const getUsers = async (req: AuthRequest, res: ResponseAdv<GetUsersRes>, next: NextFunction) => {
  const limit = parseInt(req.query.limit as string) || 100; // Default limit to 20 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // 
  const where = getQueryWhere(req);
  const whereAddress = getAddressesWhere(req, AddressEnum.user);
  
  try {
    const rows = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      limit,
      offset,
      include: [
        { model: Address, 
          as: 'warehouseAddress', 
          attributes: ['id', 'name', 'address1', 'address2', 'zip', 'state', 'email', 'phone'], 
          where: {...whereAddress,  addressType: AddressEnum.user } },
      ],
    });
    const total = rows.count;
    const users = rows.rows;
    return res.json({ users, total });
  } catch (error: any) {
    return resHeaderError('getUsers', error, req.query, res, next);
  }
};

export const getUserById = async (req: AuthRequest, res: ResponseAdv<GetUserRes>, next: NextFunction) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'email', 'role'],
      include: [
        { model: Address, 
          as: 'warehouseAddress', 
          attributes: ['id', 'name', 'address1', 'address2', 'zip', 'state', 'email', 'phone'], 
          where: { addressType: AddressEnum.user } 
        },
      ],
      where: { id: req.params.id }
    });
    if (!user) { 
      throw new NotFoundError(`User not found - ${req.params.id}`);
    };

    return res.json({ user });
  } catch (error: any) {
    return resHeaderError('getUserById', error, req.params, res, next);
  }
};

export const deleteUserById = async (req: AuthRequest, res: ResponseAdv<SimpleRes>, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError(`User not found - ${req.params.id}`);
    }

    await Address.destroy({ where: { userId: user.id, addressType: AddressEnum.user } });
    await User.destroy({ where: { id: user.id } });
    await Transaction.destroy({ where: { userId: user.id } });
    await Package.destroy({ where: { userId: user.id } });
    return res.json({ message: 'User deleted' });
  } catch (error: any) {
    return resHeaderError('deleteUserById', error, req.params, res, next);
  }
}
