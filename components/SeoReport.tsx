import React, { useState, useRef, useEffect } from 'react';
import type { SeoReportData, SeoFactor, Recommendation } from '../types';

declare const Chart: any;

const getGradeFromScore = (score: number): { grade: string; color: string; ringColor: string; } => {
  if (score >= 90) return { grade: 'A+', color: 'text-emerald-500', ringColor: 'stroke-emerald-500' };
  if (score >= 80) return { grade: 'A', color: 'text-emerald-500', ringColor: 'stroke-emerald-500' };
  if (score >= 70) return { grade: 'B', color: 'text-sky-500', ringColor: 'stroke-sky-500' };
  if (score >= 60) return { grade: 'C', color: 'text-amber-500', ringColor: 'stroke-amber-500' };
  if (score >= 50) return { grade: 'D', color: 'text-orange-500', ringColor: 'stroke-orange-500' };
  return { grade: 'F', color: 'text-red-500', ringColor: 'stroke-red-500' };
};

const GradeCircle: React.FC<{ score: number }> = ({ score }) => {
  const { grade, color, ringColor } = getGradeFromScore(score);
  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 120 120">
        <circle className="stroke-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="56" cx="60" cy="60" />
        <circle
          className={`${ringColor} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="56"
          cx="60"
          cy="60"
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${color}`}>
        <span className="text-6xl font-bold">{grade}</span>
        <span className="text-lg font-medium">{score}/100</span>
      </div>
    </div>
  );
};

const RadarChart: React.FC<{ data: SeoReportData }> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    const calculateAverage = (section: any) => {
        const scores = Object.values(section).map((v: any) => v.score);
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    };

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chartData = {
                labels: ['On-Page', 'Technical', 'Performance', 'Backlinks', 'Social'],
                datasets: [{
                    label: 'SEO Score',
                    data: [
                        calculateAverage(data.onPageSeo),
                        calculateAverage(data.technicalSeo),
                        calculateAverage(data.performanceSeo),
                        calculateAverage(data.backlinks),
                        calculateAverage(data.socialPresence),
                    ],
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    borderColor: 'rgba(14, 165, 233, 1)',
                    pointBackgroundColor: 'rgba(14, 165, 233, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(14, 165, 233, 1)',
                }]
            };

            chartInstance.current = new Chart(ctx, {
                type: 'radar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            pointLabels: { font: { size: 14 } },
                            ticks: {
                                backdropColor: 'transparent',
                                color: 'rgba(0,0,0,0.5)',
                                stepSize: 25,
                            },
                            min: 0,
                            max: 100,
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                },
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <div className="relative h-64 md:h-80"><canvas ref={chartRef}></canvas></div>;
};


const PriorityBadge: React.FC<{ priority: Recommendation['priority'] }> = ({ priority }) => {
    const styles = {
      High: 'bg-red-100 text-red-800 border-red-200',
      Medium: 'bg-amber-100 text-amber-800 border-amber-200',
      Low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${styles[priority]}`}>{priority} Priority</span>;
};

const FactorDetail: React.FC<{ title: string; data: SeoFactor }> = ({ title, data }) => {
    const isPass = data.score >= 70;
    return (
        <div className="py-4 border-b border-slate-200 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-700">{title}</h4>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isPass ? 'text-emerald-600' : 'text-red-600'}`}>{data.score}/100</span>
                    {isPass ? 
                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        :
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    }
                </div>
            </div>
             <div className="space-y-3 mt-3 text-sm">
                 <div>
                    <h5 className="font-semibold text-slate-500 mb-1">Analysis</h5>
                    <p className="text-slate-600">{data.analysis}</p>
                 </div>
                 <div>
                    <h5 className="font-semibold text-sky-700 mb-1">Recommendation</h5>
                    <div className="text-slate-700 bg-sky-50 p-3 rounded-md border border-sky-200 prose prose-sm max-w-none">
                        <p>{data.recommendation}</p>
                    </div>
                 </div>
            </div>
        </div>
    );
};

const ReportSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-sky-100 text-sky-600 rounded-full p-2">{icon}</div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);


export const SeoReport: React.FC<{ data: SeoReportData }> = ({ data }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const { onPageSeo, technicalSeo, performanceSeo, backlinks, socialPresence } = data;

    const allSections = {
        "On-Page SEO": onPageSeo,
        "Technical SEO": technicalSeo,
        "Performance": performanceSeo,
        "Backlinks": backlinks,
        "Social Presence": socialPresence,
    };

    const handleExportPdf = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);
        setShowExportOptions(false);

        try {
            const { jsPDF } = (window as any).jspdf;
            const canvas = await (window as any).html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#f8fafc' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const ratio = canvas.width / canvas.height;
            let imgHeight = pdfWidth / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save('seo-report.pdf');
        } catch (error) {
            console.error("Failed to export PDF", error);
            alert("Sorry, there was an error exporting the PDF.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportCsv = () => {
        setShowExportOptions(false);
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += `SEO Report\nOverall Score,${data.overallScore}\n\n`;
        csvContent += "Category,Factor,Score,Analysis,Recommendation\n";

        Object.entries(allSections).forEach(([category, sectionData]) => {
             Object.entries(sectionData).forEach(([key, value]) => {
                const factor = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const score = value.score;
                const analysis = `"${value.analysis.replace(/"/g, '""')}"`;
                const recommendation = `"${value.recommendation.replace(/"/g, '""')}"`;
                csvContent += `${category},${factor},${score},${analysis},${recommendation}\n`;
            });
        });
        
        csvContent += "\nTop Recommendations\nCategory,Priority,Recommendation\n";
        data.recommendations.forEach(rec => {
            csvContent += `${rec.category},${rec.priority},"${rec.text.replace(/"/g, '""')}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "seo-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="space-y-8 animate-fade-in" ref={reportRef}>
             <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">SEO Report Summary</h2>
                        <p className="mt-1 text-slate-600 max-w-md">An overview of your website's SEO performance across key categories.</p>
                    </div>
                     <div className="relative">
                        <button onClick={() => setShowExportOptions(prev => !prev)} disabled={isExporting} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 flex items-center gap-2 transition-colors">
                             {isExporting ? 'Exporting...' : 'Export Report'}
                        </button>
                        {showExportOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <button onClick={handleExportPdf} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Download PDF</button>
                                    <button onClick={handleExportCsv} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Download CSV</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
                    <div className="flex justify-center"><GradeCircle score={data.overallScore} /></div>
                    <div className="flex justify-center"><RadarChart data={data} /></div>
                </div>
            </div>

            <ReportSection title="Priority Actions" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}>
                <ul className="space-y-4">
                    {data.recommendations.map((rec, index) => (
                        <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 bg-slate-50 rounded-lg">
                           <div className="flex items-center gap-3 w-full sm:w-auto">
                             <span className="text-slate-500 font-bold text-sm">{rec.category}</span>
                             <PriorityBadge priority={rec.priority} />
                           </div>
                           <span className="text-slate-700 flex-1">{rec.text}</span>
                        </li>
                    ))}
                </ul>
            </ReportSection>

            <div className="grid md:grid-cols-2 gap-8">
                 {Object.entries(allSections).map(([title, sectionData]) => (
                    <ReportSection key={title} title={title} icon={<div />}>
                        {Object.entries(sectionData).map(([key, value]) => (
                            <FactorDetail key={key} title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} data={value as SeoFactor} />
                        ))}
                    </ReportSection>
                 ))}
            </div>
        </div>
    );
};