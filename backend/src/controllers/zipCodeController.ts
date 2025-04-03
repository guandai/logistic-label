import { ZipCode } from '../models/ZipCode';
import getZipInfo from '../utils/getInfo';
import { ResponseAdv, ZipInfo } from '@ddlabel/shared';
import { AuthRequest } from '../types';
import { resHeaderError } from '../utils/errors';
import { NotFoundError } from '../utils/errorClasses';
import { NextFunction } from 'express';

export const getZipCode = async (req: AuthRequest, res: ResponseAdv<ZipCode>, next: NextFunction) => {
  const { zip } = req.params;
  try {
    const zipCode = await ZipCode.findOne({ where: { zip } });
    if (!zipCode) {
      throw new NotFoundError(`Zip code not found - ${zip}`);
    }
    return res.json(zipCode);
  } catch (error: any) {
    return resHeaderError('getZipCode', error, req.params, res, next);
  }
};

export const getZipCodeFromFile = async (req: AuthRequest, res: ResponseAdv<ZipInfo>) => {
  try{
    const info = getZipInfo(req.params.zip);
    if (!info) {
      res.status(404).json({ message: 'Zip code not found' });
      return void 0;
    }
    res.json({ zip: req.params.zip, city: info.city, state: info.state });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
