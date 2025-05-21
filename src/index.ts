import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import proyectoRoutes from './routes/proyecto.routes';


dotenv.config();
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/proyectos', proyectoRoutes);

app.get('/perfil', (req, res) => {
  res.json({ mensaje: 'Ruta protegida de ejemplo' });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});