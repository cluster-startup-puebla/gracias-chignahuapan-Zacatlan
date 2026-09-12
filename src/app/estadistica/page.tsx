'use client';

import {useState, useEffect} from 'react';
import PinAuth from '@/components/PinAuth';
import StatsDashboard from '@/components/StatsDashboard';

export default function EstadisticaPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_pin');
    if (stored) {
      setPin(stored);
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return <PinAuth onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div>
      <StatsDashboard pin={pin} />
    </div>
  );
}
