"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type LanguageCode = "en" | "ur" | "ar" | "es" | "fr" | "de" | "hi" | "zh-CN" | "ja";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isTranslating: boolean;
  setIsTranslating: (val: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [isTranslating, setIsTranslating] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("nexus_preferred_language") as LanguageCode;
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("nexus_preferred_language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTranslating, setIsTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
