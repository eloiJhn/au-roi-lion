'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Détecter le thème initial du système et appliquer le thème
  useEffect(() => {
    // S'assurer que le code s'exécute uniquement côté client
    if (typeof window === 'undefined') return;
    
    // Fonction pour appliquer le thème sombre
    const enableDarkMode = () => {
      const htmlElement = document.documentElement;
      htmlElement.classList.add('dark-mode');
      htmlElement.classList.remove('light-mode');
      setIsDarkMode(true);
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#e0e0e0';
    };
    
    // Fonction pour appliquer le thème clair
    const disableDarkMode = () => {
      const htmlElement = document.documentElement;
      htmlElement.classList.remove('dark-mode');
      htmlElement.classList.add('light-mode');
      setIsDarkMode(false);
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
    
    try {
      // Vérifier la préférence enregistrée dans localStorage
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        // Si une préférence utilisateur est définie, l'appliquer
        if (savedTheme === 'dark') {
          enableDarkMode();
        } else {
          disableDarkMode();
        }
      } else {
        // Pas de préférence sauvegardée : utiliser la préférence système
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
          enableDarkMode();
        } else {
          disableDarkMode();
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'application du thème:', error);
    }
  }, []);

  // Basculer entre mode clair et mode sombre
  const toggleTheme = () => {
    try {
      const newDarkMode = !isDarkMode;
      const newTheme = newDarkMode ? 'dark' : 'light';
      const htmlElement = document.documentElement;
      
      // Sauvegarder la préférence utilisateur
      localStorage.setItem('theme', newTheme);
      
      if (newDarkMode) {
        // Passage en mode sombre
        htmlElement.classList.add('dark-mode');
        htmlElement.classList.remove('light-mode');
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#e0e0e0';
      } else {
        // Passage en mode clair
        htmlElement.classList.remove('dark-mode');
        htmlElement.classList.add('light-mode');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
      
      setIsDarkMode(newDarkMode);
      console.log('Thème changé par l\'utilisateur:', newTheme);
    } catch (error) {
      console.error('Erreur lors du changement de thème:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => useContext(ThemeContext); 