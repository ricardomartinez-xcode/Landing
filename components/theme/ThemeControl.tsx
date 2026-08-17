'use client';

import { useEffect, useSyncExternalStore } from 'react';
import styles from './ThemeControl.module.css';

type ThemeMode = 'system' | 'light' | 'dark';

const THEME_KEY = 'relnet-theme';
const THEME_EVENT = 'relnet-theme-change';

function readMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function resolvedTheme(mode: ThemeMode) {
  if (mode !== 'system') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = resolvedTheme(mode);
  document.documentElement.dataset.themeMode = mode;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

export function ThemeControl() {
  const mode = useSyncExternalStore(subscribe, readMode, () => 'system' as ThemeMode);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if (readMode() === 'system') applyTheme('system');
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  function changeTheme(nextMode: ThemeMode) {
    if (nextMode === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, nextMode);
    applyTheme(nextMode);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <label className={styles.control}>
      <span>Tema</span>
      <select value={mode} onChange={(event) => changeTheme(event.target.value as ThemeMode)} aria-label="Tema de la interfaz">
        <option value="system">Sistema</option>
        <option value="light">Claro</option>
        <option value="dark">Oscuro</option>
      </select>
    </label>
  );
}
