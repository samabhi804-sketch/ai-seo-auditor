import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute h-full w-full border-4 border-t-sky-500 border-slate-200 rounded-full animate-spin"></div>
        <svg className="w-12 h-12 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <p className="text-slate-600 text-lg font-medium">Performing a deep-dive analysis...</p>
      <p className="text-slate-500 text-sm max-w-xs text-center">This involves a comprehensive check of dozens of SEO factors, so it might take a moment.</p>
    </div>
  );
};