import prisma from "../config/prisma.js";
import type {
  CreateUserData,
  CreateSessionData,
  CreateOtpData,
  updateOtpData,
  ResetPasswordData,
ResetAfterLoginData
} from "../types/user.js";

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

  //  Token aur uski Expiry ko user_meta me save ya update karna
  saveResetToken: async (userId: number, token: string, expiresAt: Date) => {
    // Purane tokens delete kar dete hain taaki kachra na jama ho
    await prisma.user_meta.deleteMany({
      where: {
        user_id: userId,
        meta_key: { in: ["reset_token", "reset_token_expires_at"] },
      },
    });
    // Naya token aur expiry key-value format me insert karte hain
  },

  // ==================================================
  // NEW METHODS FOR PASSWORD OTP FLOW
  // ==================================================
  // 1. Latest OTP Record find karne ke liye
  findLatestOtpRecord: (email: string) => {
    return prisma.password_otp.findFirst({
      where: {
        email: email,
        is_used: false,
        deleted_at: null,
      },
      orderBy: { created_at: "desc" },
    });
  },

  // Naya OTP Record insert karne ke liye
  createOtpRecord: (data: CreateOtpData) => {
    return prisma.password_otp.create({
      data: {
        ...data,
        is_used: false,
        attempts: 0,
        blocked_until: null,
      },
    });
  },
  updateOtpAttempts:(data:updateOtpData)=>{
    return prisma.password_otp.update({
      where: { id: data.id },
      data:{
          attempts: data.attempts,
        blocked_until: data.blocked_until
      }
    })
  },

burnOtpRecord:({ id }: { id: number })=>{
  return prisma.password_otp.update({
    where:{id},
    data: { is_used: true }
  })

},

updatePasswordAndSoftDeleteOtp:(data:ResetPasswordData)=>{
  return prisma.$transaction([
     prisma.users.update({
       where:{ email:data.email },
       data:{ password:data.passwordHash}
     }),
      // B. OTP table me row soft-delete karein
      prisma.password_otp.update({
        where:{id:data.otpId},
        data:{
           deleted_at: new Date()
        }
      })
  ])

 },


  updateUserPasswordDirectly: async (data:ResetAfterLoginData) => {
    return await prisma.users.update({
      where: { email: data.email },
      data: { password: data.passwordHash }
    });
  }

};
           