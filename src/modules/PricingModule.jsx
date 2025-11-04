
import React, { useMemo, useState } from "react";
import { currency } from "./utils.js";
export default function PricingModule({reportRef}){
  const [km, setKm] = useState(0);
  const [costPerKm, setCostPerKm] = useState(1.0);
  const [targetMarginPct, setTargetMarginPct] = useState(15);
  const [minMarginPct, setMinMarginPct] = useState(5);

  const baseCost = useMemo(()=> km*costPerKm, [km,costPerKm]);
  const priceTarget = useMemo(()=> baseCost*(1+targetMarginPct/100), [baseCost,targetMarginPct]);
  const priceMin = useMemo(()=> baseCost*(1+minMarginPct/100), [baseCost,minMarginPct]);
  const pricePerKmTarget = useMemo(()=> km? priceTarget/km : 0, [priceTarget,km]);
  const pricePerKmMin = useMemo(()=> km? priceMin/km : 0, [priceMin,km]);

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Tarif / ofertare pe cursă</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Distanță (km)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={km} onChange={e=>setKm(parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Cost mediu (€/km)</label><input type='number' step='0.01' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={costPerKm} onChange={e=>setCostPerKm(parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Marjă țintă (%)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={targetMarginPct} onChange={e=>setTargetMarginPct(parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Marjă minimă (%)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={minMarginPct} onChange={e=>setMinMarginPct(parseFloat(e.target.value||0))} /></div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
        <h2 className='font-semibold mb-2'>Rezultat ofertă</h2>
        <div className='grid grid-cols-2 gap-2 text-sm'>
          <div>Preț minim</div><div className='text-right font-semibold'>{currency(priceMin)}</div>
          <div>Preț țintă</div><div className='text-right font-semibold'>{currency(priceTarget)}</div>
          <div>€/km minim</div><div className='text-right font-semibold'>{pricePerKmMin.toFixed(3)} €/km</div>
          <div>€/km țintă</div><div className='text-right font-semibold'>{pricePerKmTarget.toFixed(3)} €/km</div>
        </div>
      </div>
    </div>
  </div>);
}
