import type { Request, Response } from "express";
import  type {profileDTO} from "../types/user.js"// user.controller.ts
import { userModel} from "../models/user.js";
import bcrypt from "bcrypt";
import { authModel } from "../models/auth.js";
import { roleModel } from "../models/role.js";
import { assignDefaultPermissions } from "../utils/assignDefaultPermissions.js";
import type { CreateUserByOwnerDTO} from "../validations/user.schema.js";
import { success } from "zod";

export async function createUserByOwner(req: Request, res: Response) {
  try {
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
    await assignDefaultPermissions(user.id, role.name);

    res.status(201).json({
      message: "User created successfully",
      user: { uuid: user.uuid, name: user.name, email: user.email, role: role.name },
    });
  } catch (error: any) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

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
    res.status(200).json({ message: "Profile updated successfully", user:safeUser });
  } catch (error: any) {
     console.log("PROFILE UPDATE ERROR:", error);
    res.status(500).json({   error: error.message,});
  }
}
export async function getAll(req: Request, res: Response) {
try{
 const users = await userModel.findAllUsers(); 
    
    res.status(200).json({ 
      success: true,
      count: users.length,
      users 
    });
} catch (error: any) {
    console.log("GET ALL USERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userUuid = req.user!.userUuid;
    const user = await userModel.getUserProfile(userUuid);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({  error: error.message, });
  }
}
//user delte
export async function deleteProfile(req: Request, res: Response) {
  try {
    // const userUuid = req.user!.userUuid;
    const {userUuid} =req.params;
       if (typeof userUuid !== "string") {
      return res.status(400).json({ error: " user uuid is required" });
    }
    const existingUser = await userModel.findUserById(userUuid);
    if(!existingUser){
       return res.status(400).json({success:false, error: "User is not found" });
    }
     await userModel.delteUsereProfile(userUuid);
    
    res.status(200).json({success:true, message:"User deleted successfull" });
  } catch (error: any) {
    res.status(500).json({  error: error.message, });
  }
}