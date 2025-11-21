import { getWeatherByCity } from '../weatherService';

global.fetch = jest.fn();

describe('weatherService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getWeatherByCity', () => {
    it('debe retornar datos del clima correctamente para una ciudad válida', async () => {
      const mockWeatherData = {
        main: {
          temp: 25.5,
          humidity: 65,
        },
        weather: [
          {
            description: 'cielo despejado',
          },
        ],
        name: 'Madrid',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await getWeatherByCity('Madrid');

      expect(result).toEqual({
        temperature: 26,
        humidity: 65,
        description: 'cielo despejado',
        city: 'Madrid',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=Madrid')
      );
    });

    it('debe lanzar un error cuando la ciudad no se encuentra (404)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getWeatherByCity('CiudadInexistente123')).rejects.toThrow(
        'Ciudad no encontrada. Por favor verifica el nombre e intenta nuevamente.'
      );
    });

    it('debe lanzar un error cuando hay un problema de autenticación (401)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(getWeatherByCity('Madrid')).rejects.toThrow(
        'Error de autenticación con la API. Verifica tu API key.'
      );
    });

    it('debe lanzar un error cuando el nombre de la ciudad está vacío', async () => {
      await expect(getWeatherByCity('')).rejects.toThrow(
        'Por favor ingresa el nombre de una ciudad'
      );

      await expect(getWeatherByCity('   ')).rejects.toThrow(
        'Por favor ingresa el nombre de una ciudad'
      );
    });

    it('debe lanzar un error genérico cuando la respuesta no es exitosa y no es 404 ni 401', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getWeatherByCity('Madrid')).rejects.toThrow(
        'Error al obtener los datos del clima. Por favor intenta nuevamente.'
      );
    });

    it('debe manejar errores de red correctamente', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getWeatherByCity('Madrid')).rejects.toThrow('Network error');
    });

    it('debe manejar errores desconocidos que no son instancias de Error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce('String error');

      await expect(getWeatherByCity('Madrid')).rejects.toThrow(
        'Error desconocido al obtener el clima'
      );
    });
  });
});

