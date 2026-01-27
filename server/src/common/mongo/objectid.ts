import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function asObjectId(label: string, v: unknown): Types.ObjectId {
  if (v instanceof Types.ObjectId) return v;
  const s = String(v ?? '').trim();
  if (!Types.ObjectId.isValid(s)) {
    throw new BadRequestException(`${label} должен быть валидным Mongo ObjectId`);
  }
  return new Types.ObjectId(s);
}

export function asObjectIdOrNull(label: string, v: unknown): Types.ObjectId | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (s === '') return null;
  return asObjectId(label, s);
}
