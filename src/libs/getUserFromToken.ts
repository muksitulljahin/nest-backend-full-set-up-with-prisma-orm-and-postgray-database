import type { Request } from 'express';
import { Types } from 'mongoose';
// import type { AdminRole } from "../v1/modules/admin/admin.model.js";

interface UserPayload {
  userId: string; // Using _id as is common in Mongoose/MongoDB
  email: string | undefined;
  name?: string; // Optional field
  role?: string; // Optional field
  phoneNumber: string | undefined;
  iat: number | undefined;
  exp: number | undefined;
}
export interface SUserResult {
  // user এখন UserPayload হতে পারে, অথবা undefined
  user: UserPayload | undefined;
  // userId হবে string, অথবা undefined
  userId: Types.ObjectId | undefined;
  role: 'AdminRole' | 'CLIENT' | undefined;
}

const sUser = (req: Request): SUserResult => {
  const requestWithUser = req as any;
  const user: UserPayload | undefined = requestWithUser.user;
  const stringUserId: string | undefined = user?.userId;
  const role: 'AdminRole' | 'CLIENT' | undefined = user?.role as
    | 'AdminRole'
    | 'CLIENT'
    | undefined;

  let objectIdUserId: Types.ObjectId | undefined = undefined;

  // Check if stringUserId exists and is a valid ObjectId format before conversion
  if (stringUserId && Types.ObjectId.isValid(stringUserId)) {
    try {
      // Convert the string ID to a Mongoose ObjectId
      objectIdUserId = new (Types.ObjectId as any)(stringUserId);
    } catch (error) {
      // If conversion fails for some reason (though isValid should prevent this),
      // log the error and return undefined for safety.
      console.error('Error converting userId to ObjectId:', error);
      objectIdUserId = undefined;
    }
  }
  return { user, userId: objectIdUserId, role };
};

export { sUser };
