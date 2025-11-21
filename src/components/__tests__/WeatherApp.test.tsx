import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { WeatherApp } from '../WeatherApp';
import { getWeatherByCity } from '../../services/weatherService';

jest.mock('../../services/weatherService');

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { style, testID: 'linear-gradient', ...props }, children);
  },
}));

jest.mock('../GradientText', () => ({
  GradientText: ({ text, style }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { style, testID: 'gradient-text' }, text);
  },
}));

describe('WeatherApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Búsqueda exitosa', () => {
    it('debe mostrar la información del clima correctamente después de una búsqueda exitosa', async () => {
      const mockWeatherData = {
        temperature: 25,
        humidity: 70,
        description: 'cielo despejado',
        city: 'Madrid',
      };

      (getWeatherByCity as jest.Mock).mockResolvedValueOnce(mockWeatherData);

      const { getByTestId, getByText, queryByTestId } = render(<WeatherApp />);

      const input = getByTestId('city-input');
      const button = getByTestId('search-button');

      // Ingresar ciudad y buscar
      fireEvent.changeText(input, 'Madrid');
      fireEvent.press(button);

      // Esperar a que se muestre la información del clima
      await waitFor(() => {
        expect(getByText('Madrid')).toBeTruthy();
        expect(getByText('25°C')).toBeTruthy();
        expect(getByText('70%')).toBeTruthy();
        expect(getByText('Cielo despejado')).toBeTruthy();
      });

      expect(getWeatherByCity).toHaveBeenCalledWith('Madrid');
      expect(queryByTestId('error-message')).toBeNull();
    });
  });

  describe('Manejo de errores', () => {
    it('debe mostrar un mensaje de error cuando se ingresa un nombre de ciudad inválido', async () => {
      const errorMessage = 'Ciudad no encontrada. Por favor verifica el nombre e intenta nuevamente.';
      (getWeatherByCity as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const { getByTestId, getByText, queryByTestId } = render(<WeatherApp />);

      const input = getByTestId('city-input');
      const button = getByTestId('search-button');

      fireEvent.changeText(input, 'CiudadInexistente');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText(errorMessage)).toBeTruthy();
      });

      expect(queryByTestId('weather-info')).toBeNull();
    });

    it('debe mostrar un error cuando el campo está vacío', async () => {
      const { getByTestId, getByText, queryByTestId } = render(<WeatherApp />);

      const button = getByTestId('search-button');

      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('Por favor ingresa el nombre de una ciudad')).toBeTruthy();
      });

      expect(getWeatherByCity).not.toHaveBeenCalled();
      expect(queryByTestId('weather-info')).toBeNull();
    });

    it('debe manejar errores que no son instancias de Error', async () => {
      (getWeatherByCity as jest.Mock).mockRejectedValueOnce('String error');

      const { getByTestId, getByText } = render(<WeatherApp />);

      const input = getByTestId('city-input');
      const button = getByTestId('search-button');

      fireEvent.changeText(input, 'TestCity');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('Error desconocido')).toBeTruthy();
      });
    });
  });

  describe('Funcionamiento del campo de entrada y botón', () => {
    it('debe permitir ingresar texto en el campo de entrada', () => {
      const { getByTestId } = render(<WeatherApp />);

      const input = getByTestId('city-input') as any;

      fireEvent.changeText(input, 'Barcelona');

      expect(input.props.value).toBe('Barcelona');
    });

    it('debe llamar a la función de búsqueda cuando se presiona el botón', async () => {
      const mockWeatherData = {
        temperature: 20,
        humidity: 60,
        description: 'nublado',
        city: 'Barcelona',
      };

      (getWeatherByCity as jest.Mock).mockResolvedValueOnce(mockWeatherData);

      const { getByTestId } = render(<WeatherApp />);

      const input = getByTestId('city-input');
      const button = getByTestId('search-button');

      fireEvent.changeText(input, 'Barcelona');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getWeatherByCity).toHaveBeenCalledWith('Barcelona');
      });
    });

    it('debe llamar a la función de búsqueda cuando se presiona Enter en el campo de entrada', async () => {
      const mockWeatherData = {
        temperature: 18,
        humidity: 55,
        description: 'lluvia ligera',
        city: 'Valencia',
      };

      (getWeatherByCity as jest.Mock).mockResolvedValueOnce(mockWeatherData);

      const { getByTestId } = render(<WeatherApp />);

      const input = getByTestId('city-input');

      fireEvent.changeText(input, 'Valencia');
      fireEvent(input, 'submitEditing');

      await waitFor(() => {
        expect(getWeatherByCity).toHaveBeenCalledWith('Valencia');
      });
    });

    it('debe mostrar un indicador de carga mientras se busca el clima', async () => {
      let resolvePromise: (value: any) => void;
      // Simular una respuesta lenta con una promesa que podemos controlar
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (getWeatherByCity as jest.Mock).mockReturnValueOnce(promise);

      const { getByTestId, queryByText } = render(<WeatherApp />);

      const input = getByTestId('city-input');
      const button = getByTestId('search-button');

      fireEvent.changeText(input, 'Sevilla');
      fireEvent.press(button);

      // Verificar que el botón está deshabilitado durante la carga
      // El botón debería tener accessibilityState.disabled: true
      const buttonElement = getByTestId('search-button');
      expect(buttonElement.props.accessibilityState?.disabled).toBe(true);

      // Resolver la promesa para completar el test
      resolvePromise!({
        temperature: 22,
        humidity: 65,
        description: 'soleado',
        city: 'Sevilla',
      });

      await waitFor(() => {
        expect(queryByText('Sevilla')).toBeTruthy();
      });
    });
  });
});

