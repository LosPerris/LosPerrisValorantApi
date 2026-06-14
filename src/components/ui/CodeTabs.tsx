import { useState } from 'react';

interface CodeTabsProps {
  siteUrl: string;
  endpoint: string;
  botQuery: string;
}

export default function CodeTabs({ siteUrl, endpoint, botQuery }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState('curl');
  const tabs = ['curl', 'js', 'py', 'bots'];
  
  return (
    <>
      <div className="flex gap-[8px] mb-0 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-[10px_20px] font-[500] text-[0.9rem] rounded-t-[8px] transition-all cursor-pointer whitespace-nowrap relative top-[1px] ${activeTab === tab ? 'bg-[#111113] text-white border-card-border border border-b-transparent after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-color after:rounded-t-[8px]' : 'bg-[#0e0e11]/80 text-text-muted border border-card-border border-b-transparent hover:text-white hover:bg-[#111113]'}`}
          >
            {tab === 'curl' && 'cURL'}
            {tab === 'js' && 'JavaScript'}
            {tab === 'py' && 'Python'}
            {tab === 'bots' && 'Comandos Bots'}
          </button>
        ))}
      </div>

      <div className="bg-[#111113] border border-card-border rounded-tr-[8px] rounded-b-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
          <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
              <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
          </div>
          <div className="p-[25px] font-mono text-[0.9rem] text-[#e2e8f0] leading-[1.6] overflow-x-auto whitespace-pre-wrap break-all">
              {activeTab === 'curl' && `curl -X GET "${siteUrl}${endpoint}"`}
              {activeTab === 'js' && `fetch("${siteUrl}${endpoint}")\n  .then(res => res.json())\n  .then(data => console.log(data));`}
              {activeTab === 'py' && `import requests\nres = requests.get("${siteUrl}${endpoint}")\nprint(res.json())`}
              {activeTab === 'bots' && (
                  <>
                      <p className="text-[#888] mb-[10px] font-main text-[0.9rem]">Copia esto en tu Nightbot o StreamElements:</p>
                      {`$(urlfetch ${siteUrl}${endpoint}${botQuery})`}
                  </>
              )}
          </div>
      </div>
    </>
  );
}
