// backend/src/controllers/packageController.ts
import { Request } from 'express';
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { Op, WhereOptions } from 'sequelize';
import logger from '../config/logger';
import { AddressEnum, CreatePackageReq, CreatePackageRes, GetPackageRes, GetPackagesRes, PackageSource, ResponseAdv, SimpleRes, UpdatePackageReq } from '@ddlabel/shared';
import { generateTrackingNo } from '../utils/generateTrackingNo';
import { UpdatedAt } from 'sequelize-typescript';
import { start } from 'repl';
import { isDateValid } from '../utils/errors';

export const createPackage = async (req: AuthRequest, res: ResponseAdv<CreatePackageRes>) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { fromAddress, toAddress, length, width, height, weight, referenceNo, trackingNo }: CreatePackageReq = req.body;
  const userId = req.user.id;

  try {
    const pkg = await Package.create({
      userId,
      length: length || 0,
      width: width || 0,
      height: height || 0,
      weight,
      trackingNo: trackingNo || generateTrackingNo(),
      referenceNo,
      source: PackageSource.manual,
    });

    toAddress.toPackageId = fromAddress.fromPackageId = pkg.id;
    toAddress.fromPackageId = fromAddress.toPackageId = undefined;
    toAddress.userId = fromAddress.userId = userId;

    toAddress.addressType = AddressEnum.toPackage;
    fromAddress.addressType = AddressEnum.fromPackage;

    await Address.createWithInfo(fromAddress);
    await Address.createWithInfo(toAddress);

    return res.status(201).json({ success: true, packageId: pkg.id });
  } catch (error: any) {
    logger.error(`Error in createPackage: ${error}`);
    return res.status(400).json({ message: error.message, error: error.errors });
  }
};


export const getPackages = async (req: AuthRequest, res: ResponseAdv<GetPackagesRes>) => {
  const limit = parseInt(req.query.limit as string) || 100; // Default limit to 20 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // 
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  const userId = req.user.id as string;
  const tracking = req.query.tracking as string;
  const address = req.query.address as string;

  try {
    const hasTracking = tracking && tracking.length >= 2;
    const hasAddress = address && address.length >= 2;
    const hasDate = isDateValid(startDate) && isDateValid(endDate);

    const whereTracking = hasTracking ? { trackingNo: { [Op.like]: `%${tracking}%` } } : {};
    const whereDate = hasDate ? { createdAt: { [Op.between]: [startDate, endDate] } } : {};
    const wherePackage = { ...whereTracking, ...whereDate, userId };

    const whereAddress = hasAddress ? {[Op.or]: [
      { address1: { [Op.like]: `%${address}%` } },
      { address2: { [Op.like]: `%${address}%` } },
    ]} : {};
    const whereFrom = { ...whereAddress, addressType: 'fromPackage' };
    const whereTo = { ...whereAddress, addressType: 'toPackage'  };

    const include = [
      { model: Address, as: 'fromAddress', where: whereFrom },
      { model: Address, as: 'toAddress', where: whereTo },
      { model: User, as: 'user' },
      { model: Transaction, as: 'transaction' },
    ];

    const packages = await Package.findAll({
      include,
      where: wherePackage,
      limit,
      offset,
    });
    console.log(`packages`, packages);
    const total = (await Package.count({
      include,
      where: wherePackage,
    })) || 0;

    return res.json({ total, packages });
  } catch (error: any) {
    logger.error(`Error in getPackages: ${error}`);
    return res.status(400).json({ message: error.message });
  }
};

export const updatePackage = async (req: Request, res: ResponseAdv<Package>) => {
  const { fromAddress, toAddress, ...rest }: UpdatePackageReq = req.body;
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      return res.status(400).json({ message: 'Package not found' });
    }

    await Address.updateWithInfo(fromAddress);
    await Address.updateWithInfo(toAddress);
    await pkg.update(rest);
    return res.json(pkg);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deletePackage = async (req: Request, res: ResponseAdv<SimpleRes>) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      return res.status(400).json({ message: 'Package not found' });
    }

    await Address.destroy({ where: { fromPackageId: pkg.id } });
    await Address.destroy({ where: { toPackageId: pkg.id } });
    await Package.destroy({ where: { id: pkg.id } });
    return res.json({ message: 'Package deleted' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPackage = async (req: Request, res: ResponseAdv<GetPackageRes>) => {
  const { id } = req.params;

  try {
    const pkg: Package | null = await Package.findOne({
      where: { id },
      include: [
        { model: Address, as: 'fromAddress' },
        { model: Address, as: 'toAddress' },
        { model: User, as: 'user' },
      ],
    });

    if (!pkg) {
      return res.status(400).json({ message: 'Package not found' });
    }
    return res.json({ package: pkg });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
