import { Request, Response } from "express";
import { handleHttp } from "../util/error.handler";
import { _createUsuario, _login } from "../service/usuario";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const response = await _login(username, password);
    res.cookie("token", response.token, {
      maxAge: 1000 * 6000 * 6000,
      httpOnly: true,
      sameSite: "none",
      secure: true
    });
    delete response.token;
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_login", 500);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    handleHttp(res, "error_logout", 500);
  }
};

export const createRol = async (req: Request, res: Response) => {
  const { username, password, rol, id_tipo } = req.body;

  try {
    const response = await _createUsuario({ username, password, rol, id_tipo });
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_createRol", 500);
  }
};

export const validation = async (req: Request, res: Response) => {
  try {
    res.status(200).json("Si estas logeado");
  } catch (error) {
    handleHttp(res, "error_validation", 500);
  }
};
