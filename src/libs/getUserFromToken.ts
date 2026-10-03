import type { Request } from 'express';
// import type { AdminRole } from "../v1/modules/admin/admin.model.js";

interface UserPayload {
  userId: string; // Postgres primary key (UUID string)
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
  userId: string | undefined;
  role: 'AdminRole' | 'CLIENT' | undefined;
}

const sUser = (req: Request): SUserResult => {
  const requestWithUser = req as any;
  const user: UserPayload | undefined = requestWithUser.user;
  const userId: string | undefined = user?.userId || undefined;
  const role: 'AdminRole' | 'CLIENT' | undefined = user?.role as
    'AdminRole' | 'CLIENT' | undefined;

  return { user, userId, role };
};

export { sUser };
