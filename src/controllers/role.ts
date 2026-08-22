import type { Request, Response } from "express";
import { roleModel } from "../models/role.js";
import type {
  CreateRoleDTO,
  UpdateRoleDTO,
} from "../validations/role.schema.js";


// CREATE
export async function createRole(req: Request, res: Response) {
  try {
    const data: CreateRoleDTO = req.body;
    const existing = await roleModel.findByName(data.name);
    if (existing) {
      return res.status(409).json({ error: "Role already exists" });
    }
    const role = await roleModel.create(data);
    res.status(201).json({
      message: "Role created successfully",
      role: {
        uuid: role.uuid,
        name: role.name,
        status: role.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

//UPDATE
export async function updateRole(req: Request, res: Response) {
  try {
    const { uuid } = req.params;

    if (typeof uuid !== "string") {
      return res.status(400).json({
        error: "Role uuid is required",
      });
    }

    const data: UpdateRoleDTO = req.body;

    // Check role exists
    const existing = await roleModel.findByUuid(uuid);

    if (!existing) {
      return res.status(404).json({
        error: "Role not found",
      });
    }

   

    const role = await roleModel.updated(uuid, data);

    return res.status(200).json({
      message: "Role updated successfully",
      role: {
        uuid: role.uuid,
        name: role.name,
        status: role.status,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}


// DELETE (soft delete)
export async function deleteRole(req: Request, res: Response) {
  try {
    const { uuid } =req.params;
    if (typeof uuid !== "string") {
      return res.status(400).json({ error: "Role uuid is required" });
    }

    const existing = await roleModel.findByUuid(uuid);
    if (!existing) {
      return res.status(404).json({ error: "Role not found" });
    }
    await roleModel.softdelete(uuid);
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// GET ALL
export async function getAllRoles(req: Request, res: Response) {
  try {
    const roles = await roleModel.findAll();
    res.status(200).json({
      roles: roles.map((r) => ({ uuid: r.uuid, name: r.name, status: r.status })),
    });
  } catch (error: any) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

// GET ONE
export async function getRoleByUuid(req: Request, res: Response) {
  try {
    const { uuid } = req.params;

    if (typeof uuid !== "string") {
      return res.status(400).json({ error: "Role uuid is required" });
    }

    const role = await roleModel.findByUuid(uuid);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(200).json({
      role: { uuid: role.uuid, name: role.name, status: role.status },
    });
  } catch (error: any) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
