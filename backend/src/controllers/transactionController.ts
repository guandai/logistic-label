// backend/src/controllers/transactionController.ts
import { Transaction } from '../models/Transaction';
import { Op } from 'sequelize';
import { Package } from '../models/Package';
import { User } from '../models/User';
import { GetTransactionRes, GetTransactionsRes, ResponseAdv } from '@ddlabel/shared';
import { AuthRequest } from '../types';
import { resHeaderError } from '../utils/errors';
import { NotFoundError } from '../utils/errorClasses';
import { NextFunction } from 'express';

export const getTransactions = async (req: AuthRequest, res: ResponseAdv<GetTransactionsRes>, next: NextFunction) => {
  const limit = parseInt(req.query.limit as string) || 100; // Default limit to 20 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // 
  const userId = req.user.id; 
  const search = req.query.search; // 
  try {
    const total = (await Transaction.count({ where: { userId } })) || 0;

    const whereCondition = search
    ? {
        userId,
        trackingNo: {
          [Op.like]: `%${search}%`,
        },
      }
    : {userId};

    const transactions = await Transaction.findAll({
      include: [
        { model: Package, as: 'package' },
        { model: User, as: 'user' },
      ],
      where: whereCondition,
      limit,
      offset,
    });
    return res.json({ total, transactions });
  } catch (error: any) {
    return resHeaderError('getTransactions', error, req.query, res, next);
  }
};

export const getTransactionById = async (req: AuthRequest, res: ResponseAdv<GetTransactionRes>, next: NextFunction) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        { model: Package, as: 'package' },
        { model: User, as: 'user' },
      ],
    });
    if (!transaction) {
      throw new NotFoundError(`Transaction not found - ${req.params.id}`);
    }
    return res.json({transaction});
  } catch (error: any) {
    return resHeaderError('getTransactionById', error, req.params, res, next);
  }
}
