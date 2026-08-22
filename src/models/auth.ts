import prisma from "../config/prisma.js";
import type { CreateUserData,CreateSessionData  } from "../types/user.js"

export const authModel = {
  //resiter
  findUserByEmail: (email: string) => {
    return prisma.users.findUnique({ where: { email } });
  },
  // createUser: (data: { name: string; email: string; password: string }) => {
  //   return prisma.users.create({ data });
  // },
  createUser: (data: CreateUserData) => {
  return prisma.users.create({ data });
},

  //  Login ke liye naya
  // createSession: (data: {
  //   user_id: number;
  //   session_token: string;
  //   ip_address: string;
  //   user_agent: string;
  //   expires_at: Date;
  // }) => {
  //   return prisma.session.create({ data });
  // },
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





// //RESISTER
// export async function registerUser(data: RegisterDTO) {
//   //  Confirm password check
//   if (data.password !== data.confirmPassword) {
//     throw new Error("Password and confirm password do not match");
//   }
//   //  Check user already exists
//   const existingUser = await prisma.users.findUnique({
//     where: { email: data.email },
//   });

//   if (existingUser) {
//     throw new Error("User already exists");
//   }

//   // 2. Password hash
//   const hashedPassword = await bcrypt.hash(data.password, 10);

//   // 3. Create user
//   const user = await prisma.users.create({
//     data: {
//       name: data.name,
//       email: data.email,
//       password: hashedPassword,
//     },
//   });

//   return user;
// }
// //LOGIUN
// export async function loginUser(data: LoginDTO) {
//   const user = await prisma.users.findUnique({
//     where: { email: data.email },
//   });

//   if (!user) {
//     throw new Error("Invalid email or password");
//   }

//   const isPasswordCorrect = await bcrypt.compare(data.password, user.password);

//   if (!isPasswordCorrect) {
//     throw new Error("Invalid email or password");
//   }

//   const payload = {
//     userId: user.id,
//     roleId: user.role_id,
//   };

//   const accessToken = generateAccessToken(payload);
//   const refreshToken = generateRefreshToken(payload);

//   await prisma.session.create({
//     data: {
//       user_id: user.id,
//       session_token: refreshToken,
//       ip_address: data.ipAddress,
//       user_agent: data.userAgent,
//       expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     },
//   });

//   return {
//     user: {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//     },
//     accessToken,
//     refreshToken,
//   };
// }


// //REFRESHTOKEN
// export async function refreshAccessTokenService(refreshToken: string) {
// // Step A — JWT signature + expiry verify karo
//   let decoded;
// try{
//  decoded = verifyRefreshToken(refreshToken);
// }catch(error){
//  throw new Error("Invalid or expired refresh token")
// }
//   // Step B — DB mein session check karo (ye "real truth" hai)
//   const session = await prisma.session.findUnique({
//     where:{session_token:refreshToken}
//   });
// if (
//   !session ||
//   !session.is_active ||
//   session.expires_at < new Date()
// ) {
//   throw new Error("Session expired or revoked, please login again");
// }
// // Step C — naya access token banao
// const payload = {
//   userId:decoded.userId,
//   roleId: decoded.roleId
// }
//  const newAccessToken = generateAccessToken(payload);
//  return{accessToken: newAccessToken }
// }


// //LOGOUT
// export async function logoutUser(refreshToken: string) {
//   if (!refreshToken) return;

//   await prisma.session.updateMany({
//     where: { session_token: refreshToken },
//     data: {
//       is_active: false,
//       revoked_at: new Date(),
//     },
//   });
// }

