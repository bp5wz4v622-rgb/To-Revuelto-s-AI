import React, { useState, useCallback } from 'react';
import { solveProblem } from '../services/geminiService';
import Spinner from '../components/Spinner';

const DeepThinking: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) {
      setError('Por favor, introduce un problema matemático o de lógica.');
      return;
    }
    setLoading(true);
    setError(null);
    setSolution(null);
    try {
      const result = await solveProblem(problem);
      setSolution(result);
    } catch (err) {
      setError('Ocurrió un error al resolver el problema. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [problem]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Pensamiento Profundo</h2>
      <p className="mb-6 text-gray-600">
        Plantea un problema matemático o una pregunta de lógica y la IA te proporcionará una solución detallada.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Ej: Si un tren sale de A a 60 km/h y otro de B a 40 km/h, y la distancia es de 500 km, ¿dónde y cuándo se cruzan?"
          className="w-full h-32 px-4 py-3 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-100 focus:bg-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto self-end bg-blue-600 text-white font-medium py-2 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:opacity-70 transition duration-200"
        >
          {loading ? 'Pensando...' : 'Resolver'}
        </button>
      </form>

      {loading && <Spinner />}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg fade-in">{error}</p>}
      
      {solution && (
        <div className="fade-in">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Solución Detallada</h3>
          <div className="prose max-w-none p-4 bg-gray-100/60 rounded-lg border">
            <pre className="whitespace-pre-wrap font-sans">{solution}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepThinking;