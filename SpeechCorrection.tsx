import React, { useState, useCallback } from 'react';
import { correctSpeech } from './geminiService.ts';
import Spinner from './Spinner.tsx';

const SpeechCorrection: React.FC = () => {
  const [speech, setSpeech] = useState('');
  const [time, setTime] = useState('1:30');
  const [correctedSpeech, setCorrectedSpeech] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speech.trim() || !time.trim()) {
      setError('Por favor, introduce el discurso y el tiempo límite.');
      return;
    }
    setLoading(true);
    setError(null);
    setCorrectedSpeech(null);
    try {
      const result = await correctSpeech(speech, time);
      setCorrectedSpeech(result);
    } catch (err) {
      setError('Ocurrió un error al corregir el discurso. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [speech, time]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Corrección de Discurso</h2>
      <p className="mb-6 text-gray-600">
        Sube tu discurso y el tiempo que tienes. La IA lo corregirá y ajustará siguiendo la estructura de MUN y el tiempo límite (dejando 5 segundos de margen).
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          value={speech}
          onChange={(e) => setSpeech(e.target.value)}
          placeholder="Pega aquí tu discurso para corregirlo..."
          className="w-full h-48 px-4 py-3 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-100 focus:bg-white"
          disabled={loading}
        />
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Tiempo Límite (MM:SS)</label>
                <input
                  type="text"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Ej: 1:30"
                  className="w-full sm:w-40 px-3 py-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-100 focus:bg-white"
                  disabled={loading}
                />
            </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto sm:ml-auto bg-blue-600 text-white font-medium py-2 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:opacity-70 transition duration-200"
          >
            {loading ? 'Corrigiendo...' : 'Corregir Discurso'}
          </button>
        </div>
      </form>

      {loading && <Spinner />}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg fade-in">{error}</p>}
      
      {correctedSpeech && (
        <div className="fade-in">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Discurso Corregido</h3>
          <div className="prose max-w-none p-4 bg-gray-100/60 rounded-lg border">
            <pre className="whitespace-pre-wrap font-sans">{correctedSpeech}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechCorrection;
