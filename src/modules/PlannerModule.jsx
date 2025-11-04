
import React, { useMemo, useState } from "react";
import { currency, number } from "./utils.js";
export default function PlannerModule({reportRef}){
  const [rows,setRows]=useState([
    {id:1, name:"Blejoi → AT", km:1200, price:1800, tolls:180, fuel:1.35, cons:28.5},
  ]);
  function add(){ setRows(r=>[...r,{id:Date.now(), name:"", km:0, price:0, tolls:0, fuel:1.35, cons:28.5}]); }
  function upd(id, k, v){ setRows(r=> r.map(x=> x.id===id? {...x, [k]:v} : x)); }
  function del(id){ setRows(r=> r.filter(x=>x.id!==id)); }

  const summary = useMemo(()=>{
    let rev=0,cost=0,km=0;
    rows.forEach(r=>{
      rev+=Number(r.price||0);
      const liters=(r.km*(r.cons||0))/100;
      const fuelCost=liters*(r.fuel||0);
      cost+=fuelCost + (r.tolls||0);
      km+=Number(r.km||0);
    });
    return {rev,cost,km,profit:rev-cost, ePerKm: km? rev/km:0};
  },[rows]);

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Planner încărcări (sumar flotă)</h1>
    <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
      <div className='flex justify-between mb-3'>
        <div className='font-semibold'>Curse</div>
        <button onClick={add} className='px-3 py-2 bg-white text-black rounded-lg text-sm'>Adaugă</button>
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm'>
          <thead className='text-left text-gray-300'>
            <tr><th className='p-2'>Cursă</th><th className='p-2'>Km</th><th className='p-2'>Preț (€)</th><th className='p-2'>Toll (€)</th><th className='p-2'>€ / L</th><th className='p-2'>L/100</th><th className='p-2'>Acțiuni</th></tr>
          </thead>
          <tbody>
            {rows.map(r=>{
              const liters=(r.km*(r.cons||0))/100;
              const fuelCost=liters*(r.fuel||0);
              const cost=fuelCost+(r.tolls||0);
              const profit=(r.price||0)-cost;
              return (<tr key={r.id} className='border-t border-neutral-800'>
                <td className='p-2'><input value={r.name} onChange={e=>upd(r.id,'name',e.target.value)} className='bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-64'/></td>
                <td className='p-2'><input type='number' value={r.km} onChange={e=>upd(r.id,'km',parseFloat(e.target.value||0))} className='bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-24'/></td>
                <td className='p-2'><input type='number' value={r.price} onChange={e=>upd(r.id,'price',parseFloat(e.target.value||0))} className='bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-28'/></td>
                <td className='p-2'><input type='number' value={r.tolls} onChange={e=>upd(r.id,'tolls',parseFloat(e.target.value||0))} className='bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-24'/></td>
                <td className='p-2'><input type='number' step='0.01' value={r.fuel} onChange={e=>upd(r.id,'fuel',parseFloat(e.target.value||0))} className='bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-24'/></td>
                <td className='p-2'><input type='number' step='0.1' value={r.cons} onChange={e=>upd(r.id,'cons',parseFloat(e.target.value||0))} className='bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-20'/></td>
                <td className='p-2'><button onClick={()=>del(r.id)} className='text-red-400 hover:underline'>Șterge</button></td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>

      <div className='grid md:grid-cols-5 gap-3 mt-4 text-sm'>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>Total venit</div><div className='text-lg font-semibold'>{currency(summary.rev)}</div></div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>Total cost</div><div className='text-lg font-semibold'>{currency(summary.cost)}</div></div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>Profit</div><div className='text-lg font-semibold'>{currency(summary.profit)}</div></div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>Km</div><div className='text-lg font-semibold'>{number(summary.km)}</div></div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-xl p-3'><div>€/km</div><div className='text-lg font-semibold'>{summary.ePerKm.toFixed(3)} €/km</div></div>
      </div>
    </div>
  </div>);
}
