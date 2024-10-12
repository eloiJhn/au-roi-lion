"use client";

import React, { createContext, useState, useEffect } from "react";

export const TranslationContext = createContext();

const loadMessages = async (locale) => {
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.error("Erreur lors du chargement des messages:", error);
    return {};
  }
};

export const TranslationProvider = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("language");
    setCurrentLocale(savedLocale || "fr");
  }, []);

  useEffect(() => {
    if (currentLocale) {
      const fetchMessages = async () => {
        const loadedMessages = await loadMessages(currentLocale);
        setMessages(loadedMessages);
      };
      fetchMessages();
      
      window.localStorage.setItem("language", currentLocale);
    }
  }, [currentLocale]);

  const switchLanguage = () => {
    const newLocale = currentLocale === "en" ? "fr" : "en";
    setCurrentLocale(newLocale);
  };

  if (currentLocale === null) {
    return null; // or a loading indicator
  }

  return (
    <TranslationContext.Provider
      value={{ currentLocale, messages, switchLanguage }}
    >
      {children}
    </TranslationContext.Provider>
  );
};