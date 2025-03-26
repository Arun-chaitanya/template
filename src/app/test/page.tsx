'use client';

import { useState, useEffect } from 'react';

export default function TestDB() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        setStatus({ error: err.message });
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Checking database connection...</div>;

  return (
    <div>
      <h1>Database Connection Status</h1>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
} 