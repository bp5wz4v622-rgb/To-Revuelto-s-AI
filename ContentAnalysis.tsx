import React, { useState, useCallback, useRef } from 'react';
import { analyzeContent } from './geminiService.ts';
import Spinner from './Spinner.tsx';

const ContentAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
      setImageFile(null);
      setImagePreview(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) {
      setError('Por favor, introduce texto o sube una imagen para analizar.');
      return;
    }
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await analyzeContent(text, imageFile || undefined);
      setSummary(result);
    } catch (err) {
      setError('Ocurrió un error al analizar el contenido. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [text, imageFile]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Análisis de Contenido</h2>
      <p className="mb-6 text-gray-600">
        Introduce texto, sube una imagen, o ambos, y la IA condensará la información en un resumen.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pega aquí el texto que quieres analizar..."
          className="w-full h-32 px-4 py-3 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-100 focus:bg-white"
          disabled={loading}
        />
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
             <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700 bg-white hover:bg-gray-100">
                {imageFile ? imageFile.name : 'Subir Imagen (Opcional)'}
            </button>
            {imageFile && <button type="button" onClick={clearImage} className="text-sm text-red-500 hover:underline">Quitar</button>}
        </div>

        {imagePreview && (
            <div className="self-start">
                <img src={imagePreview} alt="Preview" className="h-24 w-auto rounded-lg border"/>
            </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto self-end bg-blue-600 text-white font-medium py-2 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:opacity-70 transition duration-200"
        >
          {loading ? 'Analizando...' : 'Analizar'}
        </button>
      </form>

      {loading && <Spinner />}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg fade-in">{error}</p>}
      
      {summary && (
        <div className="fade-in">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Resumen</h3>
          <div className="prose max-w-none p-4 bg-gray-100/60 rounded-lg border">
            <p>{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAnalysis;