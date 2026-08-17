'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Authenticated') {
          window.location.href = '/profile';
        } else {
          window.location.href = '/login';
        }
      })
      .catch((error) => {
        console.error('Error fetching authentication status:', error);
        window.location.href = '/login';
      });
  }, []);

  return (
    <p className="font-bold">Redirecting...</p>
  );
}
