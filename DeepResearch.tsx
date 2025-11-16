import React, { useState, useCallback } from 'react';
import { performDeepResearch } from './geminiService.ts';
import Spinner from './Spinner.tsx';
import { SearchIcon } from './Icons.tsx';

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  }
}

const DeepResearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ textResponse: string; groundingChunks: GroundingChunk[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Por favor, introduce una pregunta.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await performDeepResearch(query);
      setResult(response);
    } catch (err) {
      setError('Ocurrió un error al realizar la búsqueda. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Investigación de un Delegado</h2>
      <p className="mb-6 text-gray-600">
        Haz una pregunta y la IA buscará y clasificará las fuentes más relevantes y recientes para ti.
      </p>
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: ¿Cuáles son los objetivos de desarrollo sostenible de la ONU?"
          className="w-full pl-5 pr-14 py-3 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-gray-100 focus:bg-white shadow-sm text-gray-800 placeholder-gray-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-transparent text-gray-600 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50 transition-colors duration-300"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </form>

      {loading && <Spinner />}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg fade-in">{error}</p>}
      
      {result && (
        <div className="space-y-6 fade-in">
            <div className="prose max-w-none p-4 bg-gray-100/60 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans bg-transparent p-0">{result.textResponse}</pre>
            </div>
            {result.groundingChunks.length > 0 && (
                 <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Fuentes:</h3>
                    <ul className="list-disc list-inside space-y-2">
                        {result.groundingChunks.map((chunk, index) => chunk.web && (
                            <li key={index}>
                                <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {chunk.web.title || chunk.web.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default DeepResearch;