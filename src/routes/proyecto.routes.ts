import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verificarToken, soloAdmin, AuthRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Crear proyecto (solo admin)
router.post('/', verificarToken, soloAdmin, async (req: AuthRequest, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const proyecto = await prisma.proyecto.create({
      data: { nombre, descripcion }
    });
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proyecto.' });
  }
});

// Asignar usuario a un proyecto (solo admin)
router.post('/:id/usuarios', verificarToken, soloAdmin, async (req: AuthRequest, res) => {
  const proyectoId = Number(req.params.id);
  const { usuarioId } = req.body;
  try {
    const relacion = await prisma.usuarioProyecto.create({
      data: { proyectoId, usuarioId }
    });
    res.json(relacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar usuario al proyecto.' });
  }
});

// Crear tarea para un usuario dentro de un proyecto (solo admin)
router.post('/:id/tareas', verificarToken, soloAdmin, async (req: AuthRequest, res) => {
  const proyectoId = Number(req.params.id);
  const { titulo, descripcion, usuarioId } = req.body;
  try {
    const tarea = await prisma.tarea.create({
      data: { titulo, descripcion, proyectoId, usuarioId }
    });
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea.' });
  }
});

// Marcar tarea como completada (solo si el usuario es el asignado)
router.patch('/tareas/:id/completar', verificarToken, async (req: AuthRequest, res) => {
  const tareaId = Number(req.params.id);
  const usuarioId = req.usuario?.id;

  try {
    const tarea = await prisma.tarea.findUnique({ where: { id: tareaId } });

    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    if (tarea.usuarioId !== usuarioId)
      return res.status(403).json({ error: 'No autorizado para modificar esta tarea' });

    const tareaActualizada = await prisma.tarea.update({
  where: { id: tareaId },
  data: {
    estado: 'COMPLETADA'
  }
});

    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al completar la tarea' });
  }
});

// Obtener proyectos asignados al usuario autenticado
router.get('/', verificarToken, async (req: AuthRequest, res) => {
  const usuarioId = req.usuario?.id;
  try {
    const proyectos = await prisma.proyecto.findMany({
      where: {
        usuarios: {
          some: {
            usuarioId: usuarioId
          }
        }
      },
      include: {
        tareas: true
      }
    });
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

export default router;