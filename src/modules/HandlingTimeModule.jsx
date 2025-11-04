
import React, { useMemo, useState } from "react";
export default function HandlingTimeModule({reportRef}){
  const [loadSlots,setLoadSlots]=useState(1);
  const [loadMin,setLoadMin]=useState(60);
  const [unloadSlots,setUnloadSlots]=useState(1);
  const [unloadMin,setUnloadMin]=useState(60);
  const totalH = useMemo(()=> (loadSlots*loadMin + unloadSlots*unloadMin)/60, [loadSlots,loadMin,unloadSlots,unloadMin]);
  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Încărcare / Descărcare</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Sloturi încărcare</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={loadSlots} onChange={e=>setLoadSlots(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Min/slot încărcare</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={loadMin} onChange={e=>setLoadMin(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Sloturi descărcare</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={unloadSlots} onChange={e=>setUnloadSlots(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Min/slot descărcare</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={unloadMin} onChange={e=>setUnloadMin(parseFloat(e.target.value||0))}/></div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
        <h2 className='font-semibold mb-2'>Timp estimat</h2>
        <div className='text-3xl font-bold'>{totalH.toFixed(2)} h</div>
        <div className='text-sm text-gray-400 mt-1'>Poți include acest timp în ETA-ul total al cursei.</div>
      </div>
    </div>
  </div>);
}
