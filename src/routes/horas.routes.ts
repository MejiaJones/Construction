import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verificarToken, AuthRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/tareas/:tareaId/horas', verificarToken, async (req: AuthRequest, res) => {
  const { tareaId } = req.params;
  const { horas } = req.body;

  try {
    const tarea = await prisma.tarea.findUnique({
      where: { id: parseInt(tareaId) },
    });

    if (!tarea || tarea.usuarioId !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No autorizado para esta tarea' });
    }

    const registro = await prisma.horasTrabajo.create({
      data: {
        horas: parseFloat(horas),
        tareaId: parseInt(tareaId),
        usuarioId: req.usuario.id,
      },
    });

    res.status(201).json(registro);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar horas' });
  }
});

export default router;

