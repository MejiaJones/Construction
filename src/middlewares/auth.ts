import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secreto';

export interface AuthRequest extends Request {
  usuario?: any;
}

// Verifica token y añade usuario al request
export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Solo permite continuar si el usuario es ADMIN
export const soloAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.usuario?.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
  next();
};
