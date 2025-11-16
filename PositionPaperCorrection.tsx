import React, { useState, useCallback } from 'react';
import { correctPositionPaper } from '../services/geminiService';
import Spinner from '../components/Spinner';

interface FormData {
  commission: string;
  topic: string;
  delegation: string;
  delegate: string;
  content: string;
}

const PositionPaperCorrection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    commission: '',
    topic: '',
    delegation: '',
    delegate: '',
    content: ''
  });
  const [correctedDoc, setCorrectedDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // FIX: Cast name to keyof FormData to maintain strong typing on the state object.
    setFormData(prev => ({ ...prev, [name as keyof FormData]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Use `Object.keys` for type-safe validation. `Object.values` can return `unknown[]`, causing a type error on `.trim()`.
    if (Object.keys(formData).some(key => !formData[key as keyof FormData].trim())) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);
    setError(null);
    setCorrectedDoc(null);
    try {
      const result = await correctPositionPaper(formData);
      setCorrectedDoc(result);
    } catch (err) {
      setError('Ocurrió un error al analizar el documento. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Corrección de Documento de Posición</h2>
      <p className="mb-6 text-gray-600">
        Completa los datos y pega tu documento. La IA analizará tu borrador y te dará sugerencias para mejorar la estructura, la argumentación y el formato.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="commission" value={formData.commission} onChange={handleChange} placeholder="Comisión" className="form-input" disabled={loading} />
          <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="Tópico" className="form-input" disabled={loading} />
          <input type="text" name="delegation" value={formData.delegation} onChange={handleChange} placeholder="Delegación" className="form-input" disabled={loading} />
          <input type="text" name="delegate" value={formData.delegate} onChange={handleChange} placeholder="Delegado" className="form-input" disabled={loading} />
        </div>
        <style>{`.form-input { width: 100%; padding: 0.75rem 1rem; border-radius: 9999px; background-color: #f3f4f6; border: 2px solid transparent; transition: all 0.2s; } .form-input:focus { outline: none; ring: 2px; ring-color: #3b82f6; background-color: white; }`}</style>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Pega aquí el contenido de tu documento de posición..."
          className="w-full h-64 px-4 py-3 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-100 focus:bg-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto self-end bg-blue-600 text-white font-medium py-2 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:opacity-70 transition duration-200"
        >
          {loading ? 'Analizando...' : 'Obtener Sugerencias'}
        </button>
      </form>

      {loading && <Spinner />}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg fade-in">{error}</p>}
      
      {correctedDoc && (
        <div className="fade-in">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Sugerencias de Mejora</h3>
          <div className="prose max-w-none p-4 bg-gray-100/60 rounded-lg border">
            <pre className="whitespace-pre-wrap font-sans">{correctedDoc}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionPaperCorrection;