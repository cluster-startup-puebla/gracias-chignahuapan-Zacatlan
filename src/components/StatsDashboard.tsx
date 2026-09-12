'use client';

import {useState, useEffect} from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface Stats {
  totalScans: number;
  todayScans: number;
  byProduct: {slug: string; scans: number}[];
  byDate: {date: string; scans: number}[];
  recentScans: {slug: string; timestamp: string}[];
  emails: {email: string; slug: string; timestamp: string}[];
}

const COLORS = ['#00A884', '#00B8D9', '#0077B6', '#0E7C6B'];

export default function StatsDashboard({pin}: {pin: string}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats', {headers: {'x-admin-pin': pin}})
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando estadísticas...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Error al cargar estadísticas</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Estadísticas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm font-medium text-gray-500">Total de Escaneos</h2>
          <p className="text-3xl font-bold text-primary mt-1">{stats.totalScans}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm font-medium text-gray-500">Escaneos Hoy</h2>
          <p className="text-3xl font-bold text-primary mt-1">{stats.todayScans}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">Productos Más Escaneados</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.byProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="slug" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#00A884" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">Escaneos por Fecha</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.byDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="scans" stroke="#00A884" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">Desglose por Producto</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.byProduct}
                dataKey="scans"
                nameKey="slug"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats.byProduct.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">Escaneos Recientes</h2>
          <div className="overflow-y-auto max-h-48">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Producto</th>
                  <th className="pb-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentScans.map((scan, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{scan.slug}</td>
                    <td className="py-2 text-gray-500">
                      {new Date(scan.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Correos Recopilados</h2>
        {stats.emails.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay correos registrados aún.</p>
        ) : (
          <div className="overflow-y-auto max-h-48">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Correo</th>
                  <th className="pb-2">Producto</th>
                  <th className="pb-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {stats.emails.map((e, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{e.email}</td>
                    <td className="py-2">{e.slug}</td>
                    <td className="py-2 text-gray-500">
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
