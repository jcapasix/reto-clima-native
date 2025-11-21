import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { WeatherApp } from './src/components/WeatherApp';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <WeatherApp />
    </>
  );
}

