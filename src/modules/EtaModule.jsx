
import React, { useMemo, useState } from "react";
export default function EtaModule({reportRef}){
  const [kmHighway,setKH]=useState(0), [kmNat,setKN]=useState(0), [kmUrban,setKU]=useState(0);
  const [vh,setVh]=useState(90), [vn,setVn]=useState(70), [vu,setVu]=useState(40);
  const tH = useMemo(()=> kmHighway && vh? kmHighway/vh:0,[kmHighway,vh]);
  const tN = useMemo(()=> kmNat && vn? kmNat/vn:0,[kmNat,vn]);
  const tU = useMemo(()=> kmUrban && vu? kmUrban/vu:0,[kmUrban,vu]);
  const totalH = useMemo(()=> tH+tN+tU,[tH,tN,tU]);

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Estimare ETA (pe tip de drum)</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Km autostradă</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={kmHighway} onChange={e=>setKH(parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Viteză A (km/h)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={vh} onChange={e=>setVh(parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Km național</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={kmNat} onChange={e=>setKN(parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Viteză N (km/h)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={vn} onChange={e=>setVn(parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Km urban</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={kmUrban} onChange={e=>setKU(parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Viteză U (km/h)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={vu} onChange={e=>setVu(parseFloat(e.target.value||0))} /></div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
        <h2 className='font-semibold mb-2'>Rezultat</h2>
        <div className='grid grid-cols-2 gap-2 text-sm'>
          <div>Timp autostradă</div><div className='text-right font-semibold'>{tH.toFixed(2)} h</div>
          <div>Timp național</div><div className='text-right font-semibold'>{tN.toFixed(2)} h</div>
          <div>Timp urban</div><div className='text-right font-semibold'>{tU.toFixed(2)} h</div>
          <div>Total</div><div className='text-right font-semibold'>{totalH.toFixed(2)} h</div>
        </div>
      </div>
    </div>
  </div>);
}
