import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Circle, Trash2, Plus, Sparkles, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000/tareas';

interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
}

export default function App() {
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const queryClient = useQueryClient();

  // 1. LEER TAREAS DE POSTGRESQL (TanStack useQuery)
  const { data: tareas = [], isLoading, isError } = useQuery<Tarea[]>({
    queryKey: ['tareas'],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar tareas');
      return res.json();
    },
  });

  // 2. CREAR TAREA (TanStack useMutation)
  const crearMutation = useMutation({
    mutationFn: async (titulo: string) => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo }),
      });
      if (!res.ok) throw new Error('Error al crear tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      setNuevoTitulo('');
    },
  });

  // 3. CAMBIAR ESTADO A COMPLETADA (TanStack useMutation)
  const toggleMutation = useMutation({
    mutationFn: async ({ id, completada }: { id: number; completada: boolean }) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completada }),
      });
      if (!res.ok) throw new Error('Error al actualizar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  // 4. ELIMINAR TAREA (Envía la clave secreta de admin que creamos)
  const eliminarMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': 'admin123' }, // 👈 Tu clave de administrador
      });
      if (!res.ok) throw new Error('No autorizado o error al eliminar');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoTitulo.trim().length >= 3) {
      crearMutation.mutate(nuevoTitulo.trim());
    }
  };

  const tareasCompletadas = tareas.filter((t) => t.completada).length;

  return (
    <div className="app-container">
      <div className="card">
        {/* Cabecera */}
        <header className="header">
          <div className="badge">
            <Sparkles size={16} /> NestJS + TanStack + PostgreSQL
          </div>
          <h1>Mis Tareas</h1>
          <p className="subtitle">
            {tareas.length === 0
              ? 'No tienes tareas pendientes'
              : `${tareasCompletadas} de ${tareas.length} completadas`}
          </p>
        </header>

        {/* Formulario para agregar tarea */}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="¿Qué tienes pendiente hoy? (mínimo 3 letras)"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            className="input"
          />
          <button
            type="submit"
            disabled={nuevoTitulo.trim().length < 3 || crearMutation.isPending}
            className="btn-submit"
          >
            {crearMutation.isPending ? (
              <Loader2 className="spinner" size={20} />
            ) : (
              <>
                <Plus size={20} /> Agregar
              </>
            )}
          </button>
        </form>

        {/* Lista de Tareas */}
        {isLoading ? (
          <div className="center-msg">
            <Loader2 className="spinner" size={32} />
            <p>Cargando tareas desde PostgreSQL...</p>
          </div>
        ) : isError ? (
          <div className="error-box">
            No se pudo conectar con el Backend en http://localhost:3000. ¿Está encendido NestJS?
          </div>
        ) : tareas.length === 0 ? (
          <div className="empty-box">
            <p>🎉 ¡No hay tareas pendientes! Crea una arriba.</p>
          </div>
        ) : (
          <ul className="task-list">
            {tareas.map((tarea) => (
              <li key={tarea.id} className={`task-item ${tarea.completada ? 'completed' : ''}`}>
                <button
                  onClick={() =>
                    toggleMutation.mutate({ id: tarea.id, completada: !tarea.completada })
                  }
                  className="btn-check"
                >
                  {tarea.completada ? (
                    <CheckCircle2 className="icon-checked" size={24} />
                  ) : (
                    <Circle className="icon-unchecked" size={24} />
                  )}
                </button>

                <span className="task-text">{tarea.titulo}</span>

                <button
                  onClick={() => eliminarMutation.mutate(tarea.id)}
                  className="btn-delete"
                  title="Eliminar tarea"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}