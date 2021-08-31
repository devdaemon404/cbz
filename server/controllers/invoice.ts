import express from 'express';
import asyncHandler from '../middleware/async';
import InvoiceSchema from '../models/Invoice';
import IdUtil from '../utils/IdUtil';
import moment from 'moment';

export const createInvoice = asyncHandler(async (req, res) => {
  const { clientId, vendorId, fileKey } = req.body;

  const date = Date.now();

  const week = moment(date).week();

  const year = moment(date).year();

  const invoiceNumber = await IdUtil.generate('IN');

  const invoiceData = await InvoiceSchema.create({
    clientId,
    vendorId,
    fileKey,
    invoiceNumber: Number(invoiceNumber),
    date,
    week,
    year,
  });

  res.status(201).json({
    success: true,
    message: 'Invoice Created',
    data: invoiceData,
  });
});

export const getInvoiceForClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;

  const data = await InvoiceSchema.find({})
    .populate('clientId')
    .populate('vendorId')
    .lean();

  return res.status(200).json({
    success: true,
    data,
  });
});

export const getInvoiceForVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  const data = await InvoiceSchema.find({})
    .populate('clientId')
    .populate('vendorId')
    .lean();

  return res.status(200).json({
    success: true,
    data,
  });
});
