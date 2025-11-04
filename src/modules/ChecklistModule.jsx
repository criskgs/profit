
import React, { useState } from "react";
const ITEMS = ["CMR","Vestă reflectorizantă","Stingător","Trusă medicală","Triunghiuri","Lanternă","Documente camion","Card tahograf"];
export default function ChecklistModule({reportRef}){
  const [checked,setChecked]=useState(()=> ITEMS.map(x=>({item:x, ok:false})));
  function toggle(i){ setChecked(c=> c.map((x,idx)=> idx===i? {...x, ok:!x.ok}: x)); }
  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Checklist plecare cursă</h1>
    <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand' ref={reportRef}>
      <ul className='space-y-2'>
        {checked.map((x,i)=>(
          <li key={i} className='flex items-center gap-3'>
            <input type='checkbox' checked={x.ok} onChange={()=>toggle(i)} />
            <span className={x.ok?'line-through text-gray-400':''}>{x.item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>);
}
