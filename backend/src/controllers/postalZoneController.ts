// backend/src/controllers/postalZoneController.ts
import { PostalZone } from '../models/PostalZone';
import { GetPostalZoneRes, GetZoneRes, ResponseAdv } from '@ddlabel/shared';
import { AuthRequest } from '../types';
import { ReturnMsg } from '../utils/errors';

export const getPostalZone = async (req: AuthRequest, res: ResponseAdv<GetPostalZoneRes>) => {
  try {
    const { zip } = req.query;
    if (!zip || typeof zip !== 'string') {
      ReturnMsg(res, '!Zip code is required' );
      return void 0;
    }
    const postalZone = await PostalZone.findOne({
      where: { zip },
    });
    if (postalZone) {
      res.json({ postalZone });
    } else {
      ReturnMsg(res,`PostalZone not found by zip ${zip}`, 422);
    }
  } catch (error: any) {
    ReturnMsg(res, `getPostalZone Err: ${error.message}`);
  }
};

export const getZone = async (req: AuthRequest, res: ResponseAdv<GetZoneRes>) => {
  const { fromZip, toZip } = req.query;
  if (typeof fromZip !== 'string' || typeof toZip !=='string') {
    ReturnMsg(res, 'fromZip and toZip code should be string' );
    return void 0;
  }

  try {
    const fromPostalZone: PostalZone | null = await PostalZone.findOne({ where: { zip: fromZip } });
    const toPostalZone: PostalZone | null = await PostalZone.findOne({ where: { zip: toZip }});

    if (!fromPostalZone) {
      ReturnMsg(res, `Can Not find From PostalZone by zip ${fromZip}`, 422);
      return void 0;
    }
    if (!toPostalZone) {
      ReturnMsg(res, `Can Not find To PostalZone by zip ${toZip}`, 422);
      return void 0;
    }

    const zone = toPostalZone?.[fromPostalZone.proposal];
    if (!zone || zone === '-') {
      ReturnMsg(res, `No Avaliable Zone from ${fromPostalZone.proposal} to ${toPostalZone.proposal}`, 422);
      return void 0;
    }

    res.json({ zone });
  } catch (error: any) {
    ReturnMsg(res, error.message );
  }
};
