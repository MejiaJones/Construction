import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verificarToken } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Crear tarea real
router.post('/', verificarToken, async (req: Request, res: Response) => {
  const { titulo, descripcion, estado, usuarioId, proyectoId } = req.body;

  if (!titulo || !usuarioId || !proyectoId) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    const proyecto = await prisma.proyecto.findUnique({ where: { id: proyectoId } });

    if (!usuario || !proyecto) {
      return res.status(404).json({ mensaje: 'Usuario o proyecto no encontrado' });
    }

    const nuevaTarea = await prisma.tarea.create({
      data: {
        titulo,
        descripcion,
        estado: estado || 'PENDIENTE',
        usuarioId,
        proyectoId,
      },
    });

    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ mensaje: 'Error interno al crear la tarea' });
  }
});

router.get('/', verificarToken, async (req: any, res: Response) => {
  try {
    if (req.usuario.rol !== 'ADMIN') {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores' });
    }

    const tareas = await prisma.tarea.findMany({
      include: {
        usuario: true,
        proyecto: true,
      },
    });

    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ mensaje: 'Error al obtener tareas' });
  }
});

router.get('/mias', verificarToken, async (req: any, res: Response) => {
  try {
    const tareas = await prisma.tarea.findMany({
      where: { usuarioId: req.usuario.id },
      include: {
        proyecto: true,
      },
    });

    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener mis tareas:', error);
    res.status(500).json({ mensaje: 'Error al obtener tus tareas' });
  }
});

// Actualizar estado de una tarea
router.patch('/:id/estado', verificarToken, async (req: any, res: Response) => {
  const tareaId = parseInt(req.params.id);
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ mensaje: 'El nuevo estado es requerido' });
  }

  try {
    const tarea = await prisma.tarea.findUnique({ where: { id: tareaId } });

    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    // Solo puede actualizar el estado el admin o el usuario asignado
    if (req.usuario.rol !== 'ADMIN' && req.usuario.id !== tarea.usuarioId) {
      return res.status(403).json({ mensaje: 'No autorizado para modificar esta tarea' });
    }

    const tareaActualizada = await prisma.tarea.update({
      where: { id: tareaId },
      data: { estado },
    });

    res.json(tareaActualizada);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado de la tarea' });
  }
});


export default router;
