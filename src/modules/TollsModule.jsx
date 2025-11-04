
import React, { useMemo, useState } from "react";
import { currency } from "./utils.js";
const PRESETS=[
  {country:"AT", eurPerKm:0.25},
  {country:"DE", eurPerKm:0.19},
  {country:"FR", eurPerKm:0.32},
  {country:"IT", eurPerKm:0.28},
  {country:"RO", eurPerKm:0.05},
];
export default function TollsModule({reportRef}){
  const [km,setKm]=useState(0);
  const [preset,setPreset]=useState("AT");
  const rate = useMemo(()=> (PRESETS.find(p=>p.country===preset)?.eurPerKm ?? 0.2), [preset]);
  const total = useMemo(()=> km*rate, [km,rate]);

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Taxe drum (estimare medie)</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Țară preset</label>
            <select className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={preset} onChange={e=>setPreset(e.target.value)}>
              {PRESETS.map(p=>(<option key={p.country} value={p.country}>{p.country}</option>))}
            </select>
          </div>
          <div><label className='text-sm text-gray-300'>Km</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={km} onChange={e=>setKm(parseFloat(e.target.value||0))} /></div>
          <div className='col-span-2 text-gray-400 text-xs'>Notă: valori medii orientative; nu înlocuiesc calculul oficial per axă/clasă emisii.</div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
        <h2 className='font-semibold mb-2'>Rezultat</h2>
        <div className='text-3xl font-bold'>{currency(total)}</div>
        <div className='text-sm text-gray-400 mt-1'>Tarif folosit: {rate.toFixed(3)} €/km pentru {preset}</div>
      </div>
    </div>
  </div>);
}
