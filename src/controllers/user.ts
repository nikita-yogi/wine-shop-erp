import type { Request, Response } from "express";
import  type {profileDTO} from "../types/user.js"// user.controller.ts
import { userModel} from "../models/user.js";


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
       return res.status(400).json({ error: "User is not found" });
    }
     await userModel.delteUsereProfile(userUuid);
    
    res.status(200).json({ message:"User deleted successfull" });
  } catch (error: any) {
    res.status(500).json({  error: error.message, });
  }
}