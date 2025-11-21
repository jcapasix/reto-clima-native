export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  city: string;
}

export interface WeatherError {
  message: string;
}

const API_KEY = 'f9e0a90838e5572cd22f12dfc7637789';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  if (!city || city.trim() === '') {
    throw new Error('Por favor ingresa el nombre de una ciudad');
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ciudad no encontrada. Por favor verifica el nombre e intenta nuevamente.');
      }
      if (response.status === 401) {
        throw new Error('Error de autenticación con la API. Verifica tu API key.');
      }
      throw new Error('Error al obtener los datos del clima. Por favor intenta nuevamente.');
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      city: data.name,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al obtener el clima');
  }
};

