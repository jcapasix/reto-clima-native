import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientText } from './GradientText';
import { getWeatherByCity, WeatherData } from '../services/weatherService';
import { weatherAppStyles as styles } from '../styles/weatherAppStyles';

export const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Por favor ingresa el nombre de una ciudad');
      setWeatherData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await getWeatherByCity(city.trim());
      setWeatherData(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E8F4F8', '#F0F9FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <GradientText text="Clima en Tiempo Real" style={styles.title} />
          
          <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingresa la ciudad"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={handleSearch}
            testID="city-input"
            accessibilityLabel="Campo de entrada para nombre de ciudad"
          />
          
          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading}
            testID="search-button"
            accessibilityLabel="Botón de búsqueda de clima"
          >
            <LinearGradient
              colors={['#4A90E2', '#50C9C3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Consultar</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer} testID="error-message">
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {weatherData && (
          <LinearGradient
            colors={['#4A90E2', '#50C9C3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.weatherContainer}
            testID="weather-info"
          >
            <Text style={styles.cityName}>{weatherData.city}</Text>
            
            <View style={styles.weatherInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Temperatura</Text>
                <Text style={styles.infoValue}>{weatherData.temperature}°C</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Humedad</Text>
                <Text style={styles.infoValue}>{weatherData.humidity}%</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Condiciones</Text>
                <Text style={styles.infoValue}>
                  {weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

