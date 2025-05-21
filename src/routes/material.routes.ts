import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verificarToken, AuthRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Crear material en un proyecto
router.post('/:proyectoId/materiales', verificarToken, async (req: AuthRequest, res) => {
  if (req.usuario.rol !== 'ADMIN') return res.status(403).json({ mensaje: 'Acceso denegado' });

  const { proyectoId } = req.params;
  const { nombre, cantidad, unidad, costo } = req.body;

  try {
    const nuevoMaterial = await prisma.material.create({
      data: {
        nombre,
        cantidad,
        unidad,
        costo,
        proyectoId: parseInt(proyectoId),
      },
    });
    res.json(nuevoMaterial);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear material', detalle: error });
  }
});

// Ver materiales de un proyecto (usuario o admin asignado)
router.get('/:proyectoId/materiales', verificarToken, async (req: AuthRequest, res) => {
  const { proyectoId } = req.params;
  const idProyecto = parseInt(proyectoId);

  try {
    // Verificar si el usuario está asignado
    const estaAsignado = await prisma.proyecto.findFirst({
      where: {
        id: idProyecto,
        usuarios: {
          some: { id: req.usuario.id },
        },
      },
    });

    if (!estaAsignado) {
      return res.status(403).json({ mensaje: 'No tienes acceso a este proyecto' });
    }

    const materiales = await prisma.material.findMany({
      where: { proyectoId: idProyecto },
    });

    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materiales', detalle: error });
  }
});

export default router;
