
import React, { useMemo, useState } from "react";
export default function BreaksModule({reportRef}){
  const [distance,setDistance]=useState(0);
  const [avgSpeed,setAvgSpeed]=useState(70);
  const [drivingHours,setDrivingHours]=useState(0);
  const useDistance = distance>0 && avgSpeed>0;
  const pureDriveH = useMemo(()=> useDistance ? (distance/avgSpeed) : drivingHours, [distance,avgSpeed,drivingHours]);
  const blocks = Math.floor(pureDriveH / 4.5);
  const remaining = pureDriveH - blocks*4.5;
  const breaks = blocks * 0.75;
  const totalTime = pureDriveH + breaks;
  const needsDailyRest = pureDriveH > 9;
  const schedule=[]; let t=0;
  for(let i=0;i<blocks;i++){ schedule.push({type:'drive',hours:4.5,from:t,to:t+4.5}); t+=4.5; schedule.push({type:'break',hours:0.75,from:t,to:t+0.75}); t+=0.75; }
  if(remaining>0) schedule.push({type:'drive',hours:remaining,from:t,to:t+remaining});

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Calculator pauze șofer (informativ)</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Distanță (km)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={distance} onChange={e=>setDistance(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Viteză medie (km/h)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={avgSpeed} onChange={e=>setAvgSpeed(parseFloat(e.target.value||0))}/></div>
          <div className='col-span-2 text-center text-gray-400'>sau</div>
          <div><label className='text-sm text-gray-300'>Ore de condus (direct)</label><input type='number' step='0.25' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={drivingHours} onChange={e=>setDrivingHours(parseFloat(e.target.value||0))}/></div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
        <h2 className='font-semibold mb-2'>Rezultat</h2>
        <div className='grid grid-cols-2 gap-2 text-sm'>
          <div>Condus (fără pauze)</div><div className='text-right font-semibold'>{pureDriveH.toFixed(2)} h</div>
          <div>Pauze necesare (45min/4h30)</div><div className='text-right font-semibold'>{breaks.toFixed(2)} h</div>
          <div>Timp total estimat</div><div className='text-right font-semibold'>{(totalTime).toFixed(2)} h</div>
          <div>Depășește 9h/zi?</div><div className='text-right font-semibold'>{needsDailyRest?'Da (atenție la regulă)':'Nu'}</div>
        </div>
        <div className='mt-3 border-t border-neutral-800 pt-2 text-sm'>
          <div className='font-semibold mb-1'>Plan orar (estimativ):</div>
          <ol className='list-decimal ml-5 space-y-1'>
            {schedule.map((s,i)=>(<li key={i}>{s.type==='drive'?`Condu ${s.hours.toFixed(2)}h`:`Pauză ${s.hours.toFixed(2)}h`} (T+{s.from.toFixed(2)}h → T+{s.to.toFixed(2)}h)</li>))}
          </ol>
          <p className='text-gray-400 mt-2'>Notă: informativ; verifică legislația și tahograful.</p>
        </div>
      </div>
    </div>
  </div>);
}
