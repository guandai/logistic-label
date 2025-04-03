// backend/src/controllers/packageController.ts
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { User } from '../models/User';
import logger from '../config/logger';
import {
  AddressEnum,
  CreatePackageReq,
  CreatePackageRes,
  GetPackageRes,
  GetPackagesRes,
  PackageSource,
  ResponseAdv,
  SimpleRes,
  UpdatePackageReq
} from '@ddlabel/shared';
import { AuthRequest } from '../types';
import { generateTrackingNo } from '../utils/generateTrackingNo';
import { getRelationQuery } from './packageControllerUtil';
import { resHeaderError } from '../utils/errors';
import { NotFoundError } from '../utils/errorClasses';
import { NextFunction } from 'express';

export const createPackage = async (req: AuthRequest, res: ResponseAdv<CreatePackageRes>, next: NextFunction) => {
  if (!req.user) {
    throw new NotFoundError('User not found');
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

    const a = await Address.createWithInfo(fromAddress);
    await Address.createWithInfo(toAddress);

    res.status(201).json({ success: true, packageId: pkg.id });
    return void 0;
  } catch (error: any) {
    return resHeaderError('createPackage', error, {...req.body, user: req.user}, res, next);
  }
};

export const getPackages = async (req: AuthRequest, res: ResponseAdv<GetPackagesRes>, next: NextFunction) => {
  const limit = parseInt(req.query.limit as string) || 100; // Default limit to 20 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // 
  const relationQuery = getRelationQuery(req);

  try {
    const rows = await Package.findAndCountAll({
      ...relationQuery,
      limit,
      offset,
    });

    return res.json({ total: rows.count, packages: rows.rows });
  } catch (error: any) {
    logger.error(`Error in getPackages: ${error}`);
    return resHeaderError('getPackages', error, req.query, res, next);
  }
};

export const updatePackage = async (req: AuthRequest, res: ResponseAdv<Package>, next: NextFunction) => {
  const { fromAddress, toAddress, ...rest }: UpdatePackageReq = req.body;
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      throw new NotFoundError('Package not found');
    }

    await Address.updateWithInfo(fromAddress);
    await Address.updateWithInfo(toAddress);
    await pkg.update(rest);
    return res.json(pkg);
  } catch (error: any) {
    return resHeaderError('updatePackage', error, req.body, res, next);
  }
};

export const deletePackage = async (req: AuthRequest, res: ResponseAdv<SimpleRes>, next: NextFunction) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      throw new NotFoundError('Package not found');
    }

    await Address.destroy({ where: { fromPackageId: pkg.id, addressType: AddressEnum.fromPackage } });
    await Address.destroy({ where: { toPackageId: pkg.id, addressType: AddressEnum.toPackage } });
    await Package.destroy({ where: { id: pkg.id } });
    return res.json({ message: 'Package deleted' });
  } catch (error: any) {
    return resHeaderError('deletePackage', error, req.params, res, next);
  }
};

export const getPackage = async (req: AuthRequest, res: ResponseAdv<GetPackageRes>, next: NextFunction) => {
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
      throw new NotFoundError(`Package not found - ${id}`);
    }
    return res.json({ package: pkg });
  } catch (error: any) {
    return resHeaderError('getPackage', error, req.params, res, next);
  }
};
