import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import DeepResearch from './features/DeepResearch';
import CreateImage from './features/CreateImage';
import DeepThinking from './features/DeepThinking';
import ContentAnalysis from './features/ContentAnalysis';
import Interpellation from './features/Interpellation';
import SpeechCorrection from './features/SpeechCorrection';
import PositionPaperCorrection from './features/PositionPaperCorrection';
import TopicBreakdown from './features/TopicBreakdown';
import { Feature } from './types';
import { SearchIcon, ImageIcon, BrainIcon, DocumentIcon, EllipsisVerticalIcon, ChatBubbleLeftRightIcon, MicrophoneIcon, DocumentCheckIcon, QuestionMarkCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.DeepResearch);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const renderFeature = () => {
    switch (activeFeature) {
      case Feature.Interpellation:
        return <Interpellation />;
      case Feature.SpeechCorrection:
        return <SpeechCorrection />;
      case Feature.PositionPaperCorrection:
        return <PositionPaperCorrection />;
      case Feature.TopicBreakdown:
        return <TopicBreakdown />;
      case Feature.CreateImage:
        return <CreateImage />;
      case Feature.DeepThinking:
        return <DeepThinking />;
      case Feature.ContentAnalysis:
        return <ContentAnalysis />;
      case Feature.DeepResearch:
      default:
        return <DeepResearch />;
    }
  };

  const features: { key: Feature; label: string; icon: React.FC<{className?: string}> }[] = [
    { key: Feature.DeepResearch, label: 'Investigación de un Delegado', icon: SearchIcon },
    { key: Feature.Interpellation, label: 'Interpelación', icon: ChatBubbleLeftRightIcon },
    { key: Feature.SpeechCorrection, label: 'Corrección de Discurso', icon: MicrophoneIcon },
    { key: Feature.PositionPaperCorrection, label: 'Corrección de Documento', icon: DocumentCheckIcon },
    { key: Feature.TopicBreakdown, label: 'Desglose de Tópico', icon: QuestionMarkCircleIcon },
    { key: Feature.CreateImage, label: 'Crear / Editar Imagen', icon: ImageIcon },
    { key: Feature.DeepThinking, label: 'Pensamiento', icon: BrainIcon },
    { key: Feature.ContentAnalysis, label: 'Análisis', icon: DocumentIcon },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFeatureSelect = (key: Feature) => {
    setActiveFeature(key);
    setIsMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        {/* Mobile Dropdown Navigation */}
        <div className="md:hidden mb-6 relative" ref={dropdownRef}>
            <div className="flex justify-end">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-200/80 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                    <EllipsisVerticalIcon className="w-6 h-6" />
                </button>
            </div>
            {isMenuOpen && (
                <div className="absolute z-10 mt-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 fade-in">
                    <ul className="py-1">
                        {features.map(({ key, label, icon: Icon }) => (
                             <li key={key}>
                                <button
                                    onClick={() => handleFeatureSelect(key)}
                                    className={`w-full text-left px-4 py-3 flex items-center transition-colors duration-150 ${activeFeature === key ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${activeFeature === key ? 'text-blue-600' : 'text-gray-500'}`} />
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
          {features.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleFeatureSelect(key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                activeFeature === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200/80'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
        
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm min-h-[500px] fade-in" key={activeFeature}>
            {renderFeature()}
        </div>
      </main>
       <footer className="text-center p-4 text-gray-500 text-sm">
        © 2024 To’ Revuelto’s AI. All rights reserved.
      </footer>
    </div>
  );
};

export default App;