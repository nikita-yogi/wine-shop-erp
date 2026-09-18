import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

import type { profileDTO } from "../types/user.js";
import type { CreateUserByOwnerDTO } from "../validations/user.schema.js";

import { userModel } from "../models/user.js";
import { assignDefaultPermissions } from "../utils/assignDefaultPermissions.js";
import { ApiError } from "../utils/ApiError.js";


// ==========================================================
// CREATE USER BY OWNER
// POST /api/users
// ==========================================================

export async function createUserByOwner(req: Request, res: Response) {
  try {
    const data: CreateUserByOwnerDTO = req.body;

    // 1. Check store
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

    // 2. Check whether logged-in user is owner/admin of this store
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

    // 3. Transaction
    const result = await prisma.$transaction(async (tx) => {

      // 3.1 Check email
      const existingUser = await tx.users.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingUser) {
        throw new ApiError(409, "User already exists");
      }

      // 3.2 Find role
      const role = await tx.roles.findUnique({
        where: {
          name: data.role,
        },
      });

      if (!role) {
        throw new ApiError(400, "Invalid role");
      }

      // 3.3 Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // 3.4 Create user
      const user = await userModel.createUserWithRole(
        {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role_id: role.id,
        },
        tx,
      );

      // 3.5 Assign user to store
      await tx.store_users.create({
        data: {
          user_id: user.id,
          store_id: store.id,
          role_id: role.id,
        },
      });

      // 3.6 Assign default permissions
      const permissions = await assignDefaultPermissions(
        user.id,
        role.name,
        tx,
      );

      return {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: role.name,
        permissions,
      };
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result,
    });

  } catch (error: unknown) {

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
}


// ==========================================================
// UPDATE OWN PROFILE
// PUT /api/users/profile
// ==========================================================

export async function updateProfile(req: Request, res: Response) {
  try {
    const userUuid = req.user!.userUuid;
    const data: profileDTO = req.body;

    // Check user
    const existingUser = await userModel.findUserById(userUuid);

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Update profile
    const user = await userModel.updateUserProfile(
      userUuid,
      data,
    );

    // Never return password
    // const { password, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error: unknown) {

    console.error("PROFILE UPDATE ERROR:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}


// ==========================================================
// GET ALL USERS
// GET /api/users
// ==========================================================

export async function getAll(req: Request, res: Response) {
  try {
    const users = await userModel.findAllUsers();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error: unknown) {

    console.error("GET ALL USERS ERROR:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
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

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });

  } catch (error: unknown) {

    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}


// ==========================================================
// DELETE USER
// DELETE /api/users/:userUuid
// ==========================================================

export async function deleteProfile(req: Request, res: Response) {
  try {
    const { userUuid } = req.params;

    if (typeof userUuid !== "string") {
      return res.status(400).json({
        error: "User UUID is required",
      });
    }

    // Check user
    const existingUser = await userModel.findUserById(userUuid);

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Soft delete
    await userModel.delteUsereProfile(userUuid);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error: unknown) {

    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}

