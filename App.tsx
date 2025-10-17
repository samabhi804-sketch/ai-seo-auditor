
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SeoInputForm } from './components/SeoInputForm';
import { Loader } from './components/Loader';
import { SeoReport } from './components/SeoReport';
import { analyzeWebsiteSeo } from './services/geminiService';
import type { SeoReportData } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<SeoReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (url: string) => {
    if (!url) {
      setError('Please enter a valid website URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeWebsiteSeo(url);
      setReport(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the website. Please check the URL or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Unlock Your Website's Potential
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            Get an instant, AI-powered SEO audit to identify issues and opportunities for growth.
          </p>
          <SeoInputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          {isLoading && <Loader />}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">Oops!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
          {report && <SeoReport data={report} />}
        </div>
      </main>
      <footer className="bg-white py-4 text-center text-slate-500 border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} AI SEO Auditor. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
