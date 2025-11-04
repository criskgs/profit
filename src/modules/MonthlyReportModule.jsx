
import React, { useMemo, useState } from "react";
import { currency, number } from "./utils.js";
export default function MonthlyReportModule({reportRef}){
  const [rows,setRows]=useState([
    {id:1, truck:"TM-01", revenue:18000, fuel:6200, tolls:900, driver:2500, rate:2100, overhead:800, km:12000},
    {id:2, truck:"TM-02", revenue:16500, fuel:5800, tolls:700, driver:2300, rate:2100, overhead:800, km:11000},
  ]);
  const summary = useMemo(()=>{
    const s = rows.reduce((a,r)=>{
      a.rev+=r.revenue; a.cost+=r.fuel+r.tolls+r.driver+r.rate+r.overhead; a.km+=r.km; return a;
    },{rev:0,cost:0,km:0});
    return {...s, profit:s.rev-s.cost, eurPerKm: s.km? s.rev/s.km:0, profitPerKm: s.km? (s.rev-s.cost)/s.km:0};
  },[rows]);

  function upd(id,k,v){ setRows(r=> r.map(x=> x.id===id? {...x,[k]:v}:x)); }
  function add(){ setRows(r=>[...r,{id:Date.now(),truck:"", revenue:0,fuel:0,tolls:0,driver:0,rate:0,overhead:0,km:0}]); }
  function del(id){ setRows(r=> r.filter(x=>x.id!==id)); }

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Raport lunar flotă</h1>
    <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
      <div className='flex justify-between mb-3'>
        <div className='font-semibold'>Camioane</div>
        <button onClick={add} className='px-3 py-2 bg-white text-black rounded-lg text-sm'>Adaugă camion</button>
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm'>
          <thead className='text-left text-gray-300'>
            <tr>
              <th className='p-2'>Camion</th><th className='p-2'>Venit</th><th className='p-2'>Motorină</th><th className='p-2'>Toll</th>
              <th className='p-2'>Șofer</th><th className='p-2'>Rată</th><th className='p-2'>Alte</th><th className='p-2'>Km</th><th className='p-2'>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=> (
              <tr key={r.id} className='border-t border-neutral-800'>
                <td className='p-2'><input value={r.truck} onChange={e=>upd(r.id,'truck',e.target.value)} className='bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-24'/></td>
                {['revenue','fuel','tolls','driver','rate','overhead','km'].map(k=> (
                  <td key={k} className='p-2'><input type='number' value={r[k]} onChange={e=>upd(r.id,k,parseFloat(e.target.value||0))} className='bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-28'/></td>
                ))}
                <td className='p-2'><button onClick={()=>del(r.id)} className='text-red-400 hover:underline'>Șterge</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='grid md:grid-cols-5 gap-3 mt-4 text-sm'>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>Venit total</div><div className='text-lg font-semibold'>{currency(summary.rev)}</div></div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>Cost total</div><div className='text-lg font-semibold'>{currency(summary.cost)}</div></div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>Profit</div><div className='text-lg font-semibold'>{currency(summary.profit)}</div></div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>€/km</div><div className='text-lg font-semibold'>{summary.eurPerKm.toFixed(3)}</div></div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>Profit/km</div><div className='text-lg font-semibold'>{summary.profitPerKm.toFixed(3)}</div></div>
      </div>
    </div>
  </div>);
}
