import React, { useState, useCallback } from 'react';
import { getTopicBreakdown } from '../geminiService';
import Spinner from '../Spinner';

const TopicBreakdown: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Por favor, introduce un tópico para desglosar.');
      return;
    }
    setLoading(true);
    setError(null);
    setQuestions(null);
    try {
      const result = await getTopicBreakdown(topic);
      setQuestions(result);
    } catch (err) {
      setError('Ocurrió un error al generar las preguntas. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [topic]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Desglose de Tópico</h2>
      <p className="mb-6 text-gray-600">
        Introduce el tema de tu comité. La IA generará una serie de preguntas clave para guiar tu investigación y ayudarte a estructurar tu discurso o documento de posición.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ej: La proliferación de armas nucleares en países en desarrollo"
          className="w-full h-24 px-4 py-3 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-100 focus:bg-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto self-end bg-blue-600 text-white font-medium py-2 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:opacity-70 transition duration-200"
        >
          {loading ? 'Generando...' : 'Generar Preguntas'}
        </button>
      </form>

      {loading && <Spinner />}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg fade-in">{error}</p>}
      
      {questions && (
        <div className="fade-in">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Preguntas Guía para tu Investigación</h3>
          <div className="prose max-w-none p-4 bg-gray-100/60 rounded-lg border">
            <pre className="whitespace-pre-wrap font-sans">{questions}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicBreakdown;
