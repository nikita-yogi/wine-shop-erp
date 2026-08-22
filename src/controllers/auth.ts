import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import type { RegisterDTO, LoginDTO } from "../types/user.js";
import { authModel, } from "../models/auth.js";
import {roleModel } from "../models/role.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";



// REGISTER
// export async function register(req: Request, res: Response) {
//   try {
//     const data: RegisterDTO = req.body;
    
//     // 1. Business rule check //. Password confirmation
//     if (data.password !== data.confirmPassword) {
//       return res.status(400).json({ error: "Password and confirm password do not match" });
//     }
//     // 2. Model ko call karo — DB check
//     const existingUser = await authModel.findUserByEmail(data.email);
//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//      // 3. Hashing (business logic, DB nahi)
//     const hashedPassword = await bcrypt.hash(data.password, 10);
     
//      //  Owner role dhundo DB se (hardcode role_id mat karo, name se dhundo)
//     const ownerRole = await roleModel.findByName("owner");
//     if (!ownerRole) {
//       return res.status(500).json({ error: "Owner role not configured" });
//     }

//       // 4. Model ko call karo — DB create
//     const user = await authModel.createUser({
//       name: data.name,
//       email: data.email,
//       password: hashedPassword,
//        role_id: ownerRole.id,
//     });


//     res.status(201).json({
//       message: "Registration successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// }
export async function register(req: Request, res: Response) {
  try {
    const data: RegisterDTO = req.body;

    // 1. Password confirmation
    if (data.password !== data.confirmPassword) {
      return res.status(400).json({
        error: "Password and confirm password do not match",
      });
    }

    // 2. Existing user check
    const existingUser = await authModel.findUserByEmail(data.email);

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    // 3. Password hash
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Owner role find
    const ownerRole = await roleModel.findByName("Owner");

    if (!ownerRole) {
      return res.status(500).json({
        error: "Owner role not configured",
      });
    }

    // 5. Create user with Owner role
    const user = await authModel.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role_id: ownerRole.id,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });

  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

//LOGIN
export async function login(req: Request, res: Response) {
  try {
      const data: LoginDTO  = req.body;

     // 1. Model call — user dhundo (register wala function reuse)
    const user = await authModel.findUserByEmail(data.email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
 
    // 2. Password check (business logic)
    const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
      // 3. Token generate (business logic, DB nahi)
    const payload = { userId: user.id, userUuid: user.uuid, roleId: user.role_id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);


     // 4. Model call — session save
    await authModel.createSession({
      user_id: user.id,
      session_token: refreshToken,
      ip_address: req.ip ?? "unknown",
      user_agent: req.headers["user-agent"] ?? "unknown",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
        //cookie save in browser from server  res.cookie(name, value, options)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
       secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    });
    res.status(200).json({
      message: "Login successful",
      accessToken,
      user:{ id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

//REFRSHTOKEN
export async function refreshAccessToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token missing" });
    }

      // 1. JWT verify (business logic, DB nahi)
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
      // 2. Model call — DB me real truth check karo
    const session = await authModel.findSessionByToken(refreshToken);

// 3. Business rule check
    if (!session || !session.is_active || session.expires_at < new Date()) {
      return res.status(401).json({ error: "Session expired or revoked, please login again" });
    }
 // 4. Naya access token banao (business logic)
    const payload = { userId: decoded.userId,   userUuid: decoded.userUuid,roleId: decoded.roleId };
    const newAccessToken = generateAccessToken(payload);

   
    res.status(200).json({  accessToken: newAccessToken  });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

//LOGOUT
export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;
    // 1. Model call — session revoke karo
    if (refreshToken) {
      await authModel.revokeSession(refreshToken);
    }
 // 2. Cookie clear (business logic, DB nahi)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });



    res.status(200).json({ message: "Logged out successfully" });
  } catch (error:any) {
       res.status(500).json({ error: error.message });
  }
}






// // REGISTER
// export async function register(req: Request, res: Response) {
//   try {
//     const { name, email, password, confirmPassword } = req.body;
//     const user = await registerUser({ name, email, password, confirmPassword });

//     res.status(201).json({
//       message: "Registration successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       error: error.message,
//     });
//   }
// }

// //LOGIN
// export async function login(req: Request, res: Response) {
//   try {
//     const { email, password } = req.body;
//     const { user, accessToken, refreshToken } = await loginUser({
//       email,
//       password,
//       ipAddress: req.ip ?? "unknown",
//       userAgent: req.headers["user-agent"] ?? "unknown",
//     });

//     //cookie save in browser from server  res.cookie(name, value, options)
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//        secure: process.env.NODE_ENV === "production", 
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, //7days
//     });
//     res.status(200).json({
//       message: "Login successful",
//       accessToken,
//       user,
//     });
//   } catch (error: any) {
//     res.status(401).json({ error: error.message });
//   }
// }

// //REFRSHTOKEN
// export async function refreshAccessToken(req: Request, res: Response) {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//       return res.status(401).json({ error: "Refresh token missing" });
//     }
//     const { accessToken } = await refreshAccessTokenService(refreshToken);
//     res.status(200).json({ accessToken });
//   } catch (error: any) {
//     res.status(401).json({ error: error.message });
//   }
// }

// //LOGOUT
// export async function logout(req: Request, res: Response) {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     await logoutUser(refreshToken);

//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", 
//       sameSite: "strict",
//     });

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error:any) {
//        res.status(500).json({ error: error.message });
//   }
// }
