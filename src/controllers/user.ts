import type { Request, Response } from "express";

import type { profileDTO } from "../types/user.js"; // user.controller.ts
import type { CreateUserByOwnerDTO } from "../validations/user.schema.js";

import { userModel } from "../models/user.js";
import { authModel } from "../models/auth.js";
import { roleModel } from "../models/role.js";

import bcrypt from "bcrypt";

import { assignDefaultPermissions } from "../utils/assignDefaultPermissions.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { getUuidParam } from "../utils/getUuidParam.js";

// ==========================================================
// CREATE USER BY OWNER
// POST /api/users/
// ==========================================================

export async function createUserByOwner(req: Request, res: Response) {
  const data: CreateUserByOwnerDTO = req.body;

  // 1. Email already exist check
  const existingUser = await authModel.findUserByEmail(data.email);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  // 2. Role dhundo (jo owner ne form se select kiya)
  const role = await roleModel.findByName(data.role);
  if (!role) {
    return res.status(400).json({ error: "Invalid role" });
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
  const userUuid = req.user!.userUuid;
  const data: profileDTO = req.body;

  const existingUser = await userModel.findUserById(userUuid);
  if (!existingUser) {
    throw new ApiError(404, "User not found");
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
  const users = await userModel.findAllUsers();

 return sendSuccess(res, 200, users, {
    message: "Profile fetched successfully",
  });
}

// ==========================================================
// GET OWN PROFILE
// GET /api/users/profile
// ==========================================================

export async function getProfile(req: Request, res: Response) {
  const userUuid = req.user!.userUuid;
  const user = await userModel.getUserProfile(userUuid);

  if (!user) {
    throw new ApiError(404, "User not found");
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
  // const userUuid = req.user!.userUuid;
  const userUuid = getUuidParam(req);

  const existingUser = await userModel.findUserById(userUuid);
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }
  await userModel.delteUsereProfile(userUuid);

  return sendSuccess(res, 200, null, {
    message: "User deleted successfully",
  });
}
