'use client';

import {useState} from 'react';

interface PinAuthProps {
  onAuthenticated: () => void;
}

export default function PinAuth({onAuthenticated}: PinAuthProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await fetch('/api/stats', {
        headers: {'x-admin-pin': pin},
      });
      if (res.ok) {
        sessionStorage.setItem('admin_pin', pin);
        onAuthenticated();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-6">Panel de Estadísticas</h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingresa el PIN de acceso
          </label>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="PIN de 4 dígitos"
            className="w-full px-4 py-3 border rounded-xl text-center text-2xl tracking-widest mb-4"
            autoFocus
          />
          {error && (
            <p className="text-red-600 text-sm mb-4">PIN inválido</p>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}
