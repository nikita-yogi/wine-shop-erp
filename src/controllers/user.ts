import type { Request, Response } from "express";

import type { profileDTO } from "../types/user.js"; // user.controller.ts
import type { CreateUserByOwnerDTO } from "../validations/user.schema.js";

import { userModel } from "../models/user.js";
import { authModel } from "../models/auth.js";
import { roleModel } from "../models/role.js";

import bcrypt from "bcrypt";

import { assignDefaultPermissions } from "../utils/assignDefaultPermissions.js";
import type { CreateUserByOwnerDTO } from "../validations/user.schema.js";
import { ApiError } from "../utils/ApiError.js";

// export async function createUserByOwner(req: Request, res: Response) {
//   try {
//     const data: CreateUserByOwnerDTO = req.body;

//     // Store check
//     const store = await prisma.stores.findFirst({
//   where: {
//     uuid: data.store_uuid,
//     deleted_at: null,
//   },
// });

// if (!store) {
//   return res.status(404).json({
//     error: "Store not found",
//   });
// }

// // store admin check
// const storeAdmin = await prisma.store_admin.findFirst({
//   where: {
//     user_id: req.user!.userId,
//     store_id: store.id,
//     deleted_at: null,
//   },
// });

// if (!storeAdmin) {
//   return res.status(403).json({
//     error: "You do not have access to this store",
//   });
// }

//     // 1. Email already exist check
//     const existingUser = await authModel.findUserByEmail(data.email);
//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     // 2. Role dhundo (jo owner ne form se select kiya)
//     const role = await roleModel.findByName(data.role);
//     if (!role) {
//       return res.status(400).json({ error: "Invalid role" });
//     }

//     // 3. Password hash
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // 4. User create karo
//     const user = await userModel.createUserWithRole({
//       name: data.name,
//       email: data.email,
//       password: hashedPassword,
//       role_id: role.id,
//     });

//     // 5. Uski role ke hisab se default permissions do
//     await assignDefaultPermissions(user.id, role.name);

//     res.status(201).json({
//       message: "User created successfully",
//       user: { uuid: user.uuid, name: user.name, email: user.email, role: role.name },
//     });
//   } catch (error: any) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// }

export async function createUserByOwner(req: Request, res: Response) {
  try {
    const data: CreateUserByOwnerDTO = req.body;

    // Store check
    const store = await prisma.stores.findFirst({
      where: {
        uuid: data.store_uuid,
        deleted_at: null,
      },
    });

    if (!store) {
      return res.status(404).json({
        error: "Store not found",
      });
    }

    // Store owner/admin check
    const storeAdmin = await prisma.store_admin.findFirst({
      where: {
        user_id: req.user!.userId,
        store_id: store.id,
        role: {
          name: "owner",
        },
        deleted_at: null,
      },
    });

    if (!storeAdmin) {
      return res.status(403).json({
        error: "You do not have access to this store",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Email already exists check
      const existingUser = await tx.users.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingUser) {
        throw new ApiError(409, "User already exists");
      }

      // Role dhundo
      const role = await tx.roles.findUnique({
        where: {
          name: data.role,
        },
      });

      if (!role) {
        throw new ApiError(400, "Invalid role");
      }

      // Password hash
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // User create
      const user = await userModel.createUserWithRole(
        {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role_id: role.id,
        },
        tx,
      );

      //  store_users yahan create hoga
      await tx.store_users.create({
        data: {
          user_id: user.id,
          store_id: store.id,
          role_id: role.id,
        },
      });

      await assignDefaultPermissions(user.id, role.name, tx);

      return {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: role.name,
      };
    });

    return res.status(201).json({
      message: "User created successfully",
      user: result,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    console.error("CREATE USER ERROR:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }

  // 3. Password hash
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 4. User create karo
  const user = await userModel.createUserWithRole({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role_id: role.id,
  });

  // 5. Uski role ke hisab se default permissions do
  const permision = await assignDefaultPermissions(user.id, role.name);

  return sendSuccess(res, 201, {
  uuid: user.uuid,
  name: user.name,
  email: user.email,
  role: role.name,
  permissions: permision,
}, {
  message: "User created successfully",
});

}

// ==========================================================
// UPDATE OWN PROFILE
// PUT /api/users/profile
// ==========================================================

export async function updateProfile(req: Request, res: Response) {
  try {
    const userUuid = req.user!.userUuid;
    const data: profileDTO = req.body;

    const existingUser = await userModel.findUserById(userUuid);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await userModel.updateUserProfile(userUuid, data);
    const { password, ...safeUser } = user;
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: safeUser });
  } catch (error: any) {
    console.log("PROFILE UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }

  const user = await userModel.updateUserProfile(userUuid, data);
 

  return sendSuccess(res, 200, user, {
    message: "Profile updated successfully",
  });
}

// ==========================================================
// GET ALL USERS
// GET /api/users/
// ==========================================================

export async function getAll(req: Request, res: Response) {
  try {
    const users = await userModel.findAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    console.log("GET ALL USERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}

// ==========================================================
// GET OWN PROFILE
// GET /api/users/profile
// ==========================================================

export async function getProfile(req: Request, res: Response) {
  try {
    const userUuid = req.user!.userUuid;
    const user = await userModel.getUserProfile(userUuid);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }

  return sendSuccess(res, 200, user, {
    message: "Profile fetched successfully",
  });
}


// ==========================================================
// DELETE USER
// DELETE /api/users/:uuid
// ==========================================================

export async function deleteProfile(req: Request, res: Response) {
  try {
    // const userUuid = req.user!.userUuid;
    const { userUuid } = req.params;
    if (typeof userUuid !== "string") {
      return res.status(400).json({ error: " user uuid is required" });
    }
    const existingUser = await userModel.findUserById(userUuid);
    if (!existingUser) {
      return res.status(400).json({ error: "User is not found" });
    }
    await userModel.delteUsereProfile(userUuid);

    res.status(200).json({ message: "User deleted successfull" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
