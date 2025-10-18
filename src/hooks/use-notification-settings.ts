"use client";

import { useState, useEffect, useCallback } from 'react';

const NOTIFICATION_SETTINGS_KEY = 'crossword-notification-settings';

type NotificationSettings = {
  dailyReminder: boolean;
  rewardAlerts: boolean;
  friendActivity: boolean;
};

const defaultSettings: NotificationSettings = {
  dailyReminder: false,
  rewardAlerts: false,
  friendActivity: false,
};

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load notification settings from localStorage', error);
    }
    setIsInitialized(true);
  }, []);

  const setSetting = useCallback((key: keyof NotificationSettings, value: boolean) => {
    if (!isInitialized) return;
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [key]: value };
      try {
        localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error('Failed to save notification settings to localStorage', error);
      }
      return newSettings;
    });
  }, [isInitialized]);

  return { settings, setSetting, isInitialized };
}