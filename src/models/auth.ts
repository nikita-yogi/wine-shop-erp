import prisma from "../config/prisma.js";
import type { CreateUserData,CreateSessionData  } from "../types/user.js"

export const authModel = {
  //resiter
  findUserByEmail: (email: string) => {
    return prisma.users.findUnique({ where: { email } });
  },

  createUser: (data: CreateUserData) => {
  return prisma.users.create({ data });
},

  
  createSession: (data: CreateSessionData) => {
  return prisma.session.create({ data });
},
  //  Refresh token ke liye naya
  findSessionByToken: (token: string) => {
    return prisma.session.findUnique({
      where: { session_token: token },
    });
  },
  //  Logout ke liye naya
  revokeSession: (token: string) => {
    return prisma.session.updateMany({
      where: { session_token: token },
      data: {
        is_active: false,
        revoked_at: new Date(),
      },
    });
  },
};



