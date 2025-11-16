import React, { useState, useCallback, useRef, useEffect } from 'react';
import { startInterpellation, continueInterpellation } from '../geminiService';
import Spinner from '../Spinner';
import { Chat } from '@google/genai';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Interpellation: React.FC = () => {
  const [initialSpeech, setInitialSpeech] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleStart = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialSpeech.trim()) {
      setError('Por favor, introduce tu discurso para iniciar la interpelación.');
      return;
    }
    setLoading(true);
    setError(null);
    setConversation([]);
    setChatSession(null);
    try {
      const { chat, firstMessage } = await startInterpellation(initialSpeech);
      setChatSession(chat);
      setConversation([
          { sender: 'user', text: `(Discurso inicial)\n${initialSpeech}` },
          { sender: 'ai', text: firstMessage }
      ]);
    } catch (err) {
      setError('Ocurrió un error al iniciar el debate. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [initialSpeech]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !chatSession || loading) {
        return;
    }
    const userMessage: Message = { sender: 'user', text: currentMessage };
    setConversation(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    try {
        const aiResponse = await continueInterpellation(chatSession, currentMessage);
        const aiMessage: Message = { sender: 'ai', text: aiResponse };
        setConversation(prev => [...prev, aiMessage]);
    } catch (err) {
        setError('Ocurrió un error al obtener la respuesta. Por favor, inténtalo de nuevo.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Interpelación</h2>
      <p className="mb-6 text-gray-600">
        Introduce tu discurso. La IA actuará como otro delegado, analizará tus puntos débiles e iniciará un debate.
      </p>

      {!chatSession ? (
        <form onSubmit={handleStart} className="flex flex-col gap-4">
          <textarea
            value={initialSpeech}
            onChange={(e) => setInitialSpeech(e.target.value)}
            placeholder="Pega aquí tu discurso completo..."
            className="w-full h-48 px-4 py-3 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-100 focus:bg-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto self-end bg-blue-600 text-white font-medium py-2 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:opacity-70 transition duration-200"
          >
            {loading ? 'Analizando...' : 'Iniciar Debate'}
          </button>
        </form>
      ) : (
        <div className="flex flex-col h-[600px] border rounded-lg bg-gray-50">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg px-4 py-2 rounded-xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="flex justify-start"><Spinner/></div>}
                <div ref={conversationEndRef} />
            </div>
             <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                <div className="relative">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        className="w-full pl-4 pr-12 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading || !currentMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </form>
        </div>
      )}

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mt-4 fade-in">{error}</p>}
    </div>
  );
};

export default Interpellation;
