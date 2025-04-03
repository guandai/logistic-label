import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
import { GetPackagesCsvRes, ResponseAdv } from '@ddlabel/shared';
import { AuthRequest } from '../types';
import { Address } from '../models/Address';
import { Package } from '../models/Package';
import { getRelationQuery } from './packageControllerUtil';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'json2csv'; // Import parse from json2csv
import { resHeaderError } from '../utils/errors';
import { NextFunction } from 'express';

const csvFieldsMapping = [
  { label: 'id', value: 'id' },
  { label: 'weight', value: 'weight' },
  { label: 'height', value: 'height' },
  { label: 'length', value: 'length' },
  { label: 'width', value: 'width' },
  { label: 'referenceNo', value: 'referenceNo' },
  { label: 'trackingNo', value: 'trackingNo' },
  { label: 'createdAt', value: 'createdAt' },
  { label: 'updatedAt', value: 'updatedAt' },
  { label: 'toAddressName', value: 'toAddress.name' },
  { label: 'toAddressPhone', value: 'toAddress.phone' },
  { label: 'toAddressEmail', value: 'toAddress.email' },
  { label: 'toAddress1', value: 'toAddress.address1' },
  { label: 'toAddress2', value: 'toAddress.address2' },
  { label: 'toAddressCity', value: 'toAddress.city' },
  { label: 'toAddressState', value: 'toAddress.state' },
  { label: 'toAddressZip', value: 'toAddress.zip' },
  { label: 'fromAddressName', value: 'fromAddress.name' },
  { label: 'fromAddressPhone', value: 'fromAddress.phone' },
  { label: 'fromAddressEmail', value: 'fromAddress.email' },
  { label: 'fromAddress1', value: 'fromAddress.address1' },
  { label: 'fromAddress2', value: 'fromAddress.address2' },
  { label: 'fromAddressCity', value: 'fromAddress.city' },
  { label: 'fromAddressState', value: 'fromAddress.state' },
  { label: 'fromAddressZip', value: 'fromAddress.zip' },
];

export const getCsvPackages = async (req: AuthRequest, res: ResponseAdv<GetPackagesCsvRes>, next: NextFunction) => {
  const relationQuery = getRelationQuery(req);
  try {
    const packages = await Package.findAll({
      ...relationQuery,
      attributes: { exclude: ['userId'] }, // Exclude user column
      include: [
        {
          model: Address, as: 'fromAddress',
          attributes: ['address1', 'address2', 'city', 'state', 'zip', 'name', 'phone', 'email'],
        },
        {
          model: Address, as: 'toAddress',
          attributes: ['address1', 'address2', 'city', 'state', 'zip', 'name', 'phone', 'email'],
        },
      ],
    });
    
    // Convert the data to JSON
    const packagesData = packages.map(pkg => pkg.toJSON());
    // Convert JSON to CSV
    const csv = parse(packagesData, { fields: csvFieldsMapping });
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="packages_${uuidv4()}.csv"`);
    res.send(csv);
  } catch (error: any) {
    resHeaderError('getCsvPackages', error, req.query, res, next);
  }
};
