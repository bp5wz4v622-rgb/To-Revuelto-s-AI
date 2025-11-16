import React, { useState, useCallback, useRef } from 'react';
import { generateOrEditImage } from './geminiService.ts';
import Spinner from './Spinner.tsx';

const CreateImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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
    if (!prompt.trim()) {
      setError('Por favor, describe la imagen que quieres crear o la edición que quieres realizar.');
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await generateOrEditImage(prompt, imageFile || undefined);
      setGeneratedImage(result);
    } catch (err) {
      setError('Ocurrió un error al procesar la imagen. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [prompt, imageFile]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear o Editar Imagen</h2>
      <p className="mb-6 text-gray-600">
        Describe la imagen que deseas generar, o sube una imagen para editarla con tus instrucciones.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Un astronauta a caballo en Marte, o 'añade un sombrero al personaje'."
          className="w-full h-24 px-4 py-3 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-100 focus:bg-white"
          disabled={loading}
        />
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
             <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700 bg-white hover:bg-gray-100">
                {imageFile ? imageFile.name : 'Subir para Editar (Opcional)'}
            </button>
            {imageFile && <button type="button" onClick={clearImage} className="text-sm text-red-500 hover:underline">Quitar imagen</button>}
             <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 text-white font-medium py-2 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:opacity-70 transition duration-200"
            >
                {loading ? 'Procesando...' : 'Generar / Editar'}
            </button>
        </div>
      </form>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 fade-in">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">{imageFile ? "Imagen para Editar" : "Entrada"}</h3>
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border">
                {imagePreview ? (
                <img src={imagePreview} alt="To Edit" className="max-w-full max-h-full object-contain rounded-xl" />
                ) : (
                <p className="text-gray-500 p-4">Sube una imagen para editarla o simplemente usa el campo de texto para generar una nueva.</p>
                )}
            </div>
        </div>
        <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Resultado</h3>
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border">
            {loading && <Spinner />}
            {!loading && generatedImage && (
                <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-xl fade-in" />
            )}
            {!loading && !generatedImage && <p className="text-gray-500">El resultado aparecerá aquí.</p>}
            </div>
        </div>
       </div>
    </div>
  );
};

export default CreateImage;