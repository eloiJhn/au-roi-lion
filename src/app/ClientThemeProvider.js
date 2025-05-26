'use client';
import React from 'react';

// This is a client component that can safely use client-side features
export default function ClientThemeProvider({ children }) {
  return <>{children}</>;
} 