
import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import ProfitModule from "./modules/ProfitModule.jsx";
import FuelModule from "./modules/FuelModule.jsx";
import BreaksModule from "./modules/BreaksModule.jsx";
import PricingModule from "./modules/PricingModule.jsx";
import PlannerModule from "./modules/PlannerModule.jsx";
import EtaModule from "./modules/EtaModule.jsx";
import TollsModule from "./modules/TollsModule.jsx";
import ConsumptionModule from "./modules/ConsumptionModule.jsx";
import HandlingTimeModule from "./modules/HandlingTimeModule.jsx";
import DriverCostModule from "./modules/DriverCostModule.jsx";
import ChecklistModule from "./modules/ChecklistModule.jsx";
import MonthlyReportModule from "./modules/MonthlyReportModule.jsx";

const LOGO_FALLBACKS=['/logo-proelite.png','https://proelitedistribution.ro/wp-content/uploads/2025/10/proelite-logo-2-scaled.png'];
const TABS=[
  {key:'profit',label:'Profit camion'},
  {key:'fuel',label:'Motorină necesară'},
  {key:'breaks',label:'Pauze șofer'},
  {key:'pricing',label:'Tarif / ofertare'},
  {key:'planner',label:'Planner încărcări'},
  {key:'eta',label:'Estimare ETA'},
  {key:'tolls',label:'Taxe drum (medie)'},
  {key:'consumption',label:'Simulare consum'},
  {key:'handling',label:'Încărcare/Descărcare'},
  {key:'drivercost',label:'Cost șofer'},
  {key:'checklist',label:'Checklist cursă'},
  {key:'monthly',label:'Raport lunar'},
];

export default function App(){
  const [tab,setTab]=useState('profit');
  const [logoIdx,setLogoIdx]=useState(0);
  const [logoSrc,setLogoSrc]=useState(LOGO_FALLBACKS[0]);
  useEffect(()=>setLogoSrc(LOGO_FALLBACKS[logoIdx]),[logoIdx]);

  const reportRef=useRef(null);
  function exportPDF(){
    if(!reportRef.current) return;
    const landscapeTabs = ['profit','planner','monthly'];
    const opt={margin:[10,10,10,10], filename:`raport-${tab}.pdf`, image:{type:'jpeg',quality:0.98},
      html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},
      jsPDF:{unit:'mm',format:'a4',orientation: landscapeTabs.includes(tab)?'landscape':'portrait'},
      pagebreak:{mode:['css','legacy']}};
    html2pdf().set(opt).from(reportRef.current).save();
  }

  return (<div className='min-h-screen bg-[color:var(--brand-dark)] text-white'>
    <div className='bg-black border-b border-[#2d2d2d] sticky top-0 z-10 no-print'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <img src={logoSrc} alt='Pro Elite Distribution' className='h-10 w-auto'
            onError={()=>{ if(logoIdx+1<LOGO_FALLBACKS.length) setLogoIdx(logoIdx+1); }} />
          <div className='font-semibold'>Pro Elite Dispatch Suite</div>
        </div>
        <button onClick={exportPDF} className='px-4 py-2 rounded-xl bg-white text-black font-medium hover:opacity-90 shadow'>Descarcă PDF</button>
      </div>
      <div className='max-w-7xl mx-auto px-6 pb-3 flex flex-wrap gap-2'>
        {TABS.map(t=>(<button key={t.key} onClick={()=>setTab(t.key)} className={'px-3 py-2 rounded-lg text-sm '+(tab===t.key?'bg-[#1F1F1F]':'hover:bg-[#1b1b1b]')}>{t.label}</button>))}
      </div>
    </div>

    <div className='max-w-7xl mx-auto px-6 py-6'>
      {tab==='profit' && <ProfitModule reportRef={reportRef} />}
      {tab==='fuel' && <FuelModule reportRef={reportRef} />}
      {tab==='breaks' && <BreaksModule reportRef={reportRef} />}
      {tab==='pricing' && <PricingModule reportRef={reportRef} />}
      {tab==='planner' && <PlannerModule reportRef={reportRef} />}
      {tab==='eta' && <EtaModule reportRef={reportRef} />}
      {tab==='tolls' && <TollsModule reportRef={reportRef} />}
      {tab==='consumption' && <ConsumptionModule reportRef={reportRef} />}
      {tab==='handling' && <HandlingTimeModule reportRef={reportRef} />}
      {tab==='drivercost' && <DriverCostModule reportRef={reportRef} />}
      {tab==='checklist' && <ChecklistModule reportRef={reportRef} />}
      {tab==='monthly' && <MonthlyReportModule reportRef={reportRef} />}
      <footer className='text-center text-gray-400 text-sm mt-8'>Cristian Mandoiu, Pro Elite Ditribution 2025</footer>
    </div>
  </div>);
}
