
import React, { useMemo, useState } from "react";
import { number } from "./utils.js";
export default function FuelModule({reportRef}){
  const [distance,setDistance]=useState(0);
  const [avgConsumption,setAvgConsumption]=useState(28.5);
  const [reservePct,setReservePct]=useState(10);
  const liters = useMemo(()=> (distance*(avgConsumption||0))/100, [distance,avgConsumption]);
  const totalNeeded = useMemo(()=> liters*(1+(reservePct||0)/100), [liters,reservePct]);

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Motorină necesară</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Distanță (km)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={distance} onChange={e=>setDistance(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Consum (L/100km)</label><input type='number' step='0.1' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={avgConsumption} onChange={e=>setAvgConsumption(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Rezervă (%)</label><input type='number' step='1' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={reservePct} onChange={e=>setReservePct(parseFloat(e.target.value||0))}/></div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
        <h2 className='font-semibold mb-2'>Rezultat</h2>
        <div className='text-3xl font-bold'>{Math.ceil(totalNeeded)} L</div>
        <div className='text-sm text-gray-400 mt-1'>(consum estimat {Math.round(liters)} L + rezervă {reservePct}%)</div>
      </div>
    </div>
  </div>);
}
