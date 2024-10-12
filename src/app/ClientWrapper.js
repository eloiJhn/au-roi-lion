"use client";


import { useEffect } from 'react';

export default function ClientWrapper({ children }) {
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.removeAttribute('cz-shortcut-listen');
    }
  }, []);

  return <>{children}</>;
}