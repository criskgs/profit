
import React, { useMemo, useState } from "react";
export default function ConsumptionModule({reportRef}){
  const [km,setKm]=useState(1000);
  const [consA,setA]=useState(27);
  const [consB,setB]=useState(30);
  const [fuel,setFuel]=useState(1.35);
  const litersA = useMemo(()=> km*consA/100, [km,consA]);
  const litersB = useMemo(()=> km*consB/100, [km,consB]);
  const deltaL = useMemo(()=> litersB - litersA, [litersA,litersB]);
  const deltaEur = useMemo(()=> deltaL*fuel, [deltaL,fuel]);

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Simulare consum (comparativ)</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Km</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={km} onChange={e=>setKm(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Preț motorină (€/L)</label><input type='number' step='0.01' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={fuel} onChange={e=>setFuel(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Consum A (L/100)</label><input type='number' step='0.1' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={consA} onChange={e=>setA(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Consum B (L/100)</label><input type='number' step='0.1' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={consB} onChange={e=>setB(parseFloat(e.target.value||0))}/></div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
        <h2 className='font-semibold mb-2'>Diferență cost</h2>
        <div className='text-2xl font-bold'>{deltaL.toFixed(0)} L ({deltaEur.toFixed(0)} €)</div>
        <div className='text-sm text-gray-400 mt-1'>Economia pe {km} km dacă scazi consumul de la {consB} la {consA} L/100km.</div>
      </div>
    </div>
  </div>);
}
