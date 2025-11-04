
import React, { useMemo, useState } from "react";
import { currency } from "./utils.js";
export default function DriverCostModule({reportRef}){
  const [days,setDays]=useState(30);
  const [daily,setDaily]=useState(95);
  const [salary,setSalary]=useState(0);
  const [bonus,setBonus]=useState(0);
  const total = useMemo(()=> days*daily + salary + bonus, [days,daily,salary,bonus]);

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Cost șofer (diurnă + salariu + bonus)</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Zile active</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={days} onChange={e=>setDays(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Diurnă (€/zi)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={daily} onChange={e=>setDaily(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Salariu fix (€)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={salary} onChange={e=>setSalary(parseFloat(e.target.value||0))}/></div>
          <div><label className='text-sm text-gray-300'>Bonus (€)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={bonus} onChange={e=>setBonus(parseFloat(e.target.value||0))}/></div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
        <h2 className='font-semibold mb-2'>Cost total</h2>
        <div className='text-3xl font-bold'>{currency(total)}</div>
      </div>
    </div>
  </div>);
}
