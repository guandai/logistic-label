import { NextFunction, Response } from 'express';
import { SortCode } from '../models/SortCode';
import { AuthRequest } from '../types';
import { resHeaderError } from '../utils/errors';
import { NotFoundError } from '../utils/errorClasses';

exports.getAllSortCodes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sortCodes = await SortCode.findAll();
    return res.json(sortCodes);
  } catch (error: any) {
    return resHeaderError('getAllSortCodes', error, req.query, res, next);
  }
};

exports.createSortCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const newSortCode = await SortCode.create(req.body);
    return res.status(201).json(newSortCode);
  } catch (error: any) {
    return resHeaderError('createSortCode', error, req.body, res, next);
  }
};

exports.updateSortCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await SortCode.update(req.body, { where: { id: id } });
    if (!updated) {
      throw new NotFoundError(`Sort code not found - ${id}`);
    }
    const updatedSortCode = await SortCode.findByPk(id);
    return res.json(updatedSortCode);
  } catch (error: any) {
    return resHeaderError('updateSortCode', error, req.params, res, next);
  }
};

exports.deleteSortCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!await SortCode.destroy({ where: { id: req.params } })) {
      throw new NotFoundError('Sort code not found');
    }
    return res.status(200).send({success: true});
  } catch (error: any) {
    return resHeaderError('deleteSortCode', error, req.params, res, next);
  }
};
