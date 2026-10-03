/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema } from 'mongoose';
import { ConflictException } from '@nestjs/common';

/**
 * Reusable Mongoose helper to enforce uniqueness on a specific field.
 * Adds 'save' and 'findOneAndUpdate' pre-hooks to check for duplicates and throw a standard 11000 duplicate error.
 *
 * @param schema Mongoose Schema
 * @param fieldName The name of the field to enforce uniqueness on (e.g. 'code')
 */
export function enforceUniqueField(schema: Schema, fieldName: string) {
  schema.pre('save', async function (this: any) {
    const self = this;
    if (self.isModified(fieldName)) {
      const val = self[fieldName];
      if (val === undefined || val === null || val === '') {
        return;
      }
      const count = await self.constructor.countDocuments({
        [fieldName]: val,
        _id: { $ne: self._id },
      });
      if (count > 0) {
        const err = new ConflictException(
          `Duplicate key error: ${fieldName} "${val}" already exists`,
        );
        (err as any).code = 11000;
        (err as any).keyValue = { [fieldName]: val };
        throw err;
      }
    }
  });

  const checkUpdateQuery = async function (this: any) {
    const update = this.getUpdate();
    if (update) {
      const fieldValue =
        update[fieldName] !== undefined
          ? update[fieldName]
          : update.$set && update.$set[fieldName];

      if (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== ''
      ) {
        const query = this.getQuery();
        let docId = query._id;

        if (!docId) {
          const existingDoc = await this.model.findOne(query);
          if (existingDoc) {
            docId = existingDoc._id;
          }
        }

        const filter: any = { [fieldName]: fieldValue };
        if (docId) {
          filter._id = { $ne: docId };
        }

        const count = await this.model.countDocuments(filter);
        if (count > 0) {
          const err = new ConflictException(
            `Duplicate key error: ${fieldName} "${fieldValue}" already exists`,
          );
          (err as any).code = 11000;
          (err as any).keyValue = { [fieldName]: fieldValue };
          throw err;
        }
      }
    }
  };

  schema.pre('findOneAndUpdate', checkUpdateQuery);
  schema.pre('updateOne', checkUpdateQuery);
  schema.pre('updateMany', checkUpdateQuery);
}
