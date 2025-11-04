
import React, { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { currency } from "./utils.js";

function daysBetweenInclusive(startISO, endISO) {
  if (!startISO || !endISO) return 0;
  const start = new Date(startISO), end = new Date(endISO);
  start.setHours(12,0,0,0); end.setHours(12,0,0,0);
  return Math.max(Math.floor((end-start)/(1000*60*60*24))+1,0);
}

export default function ProfitModule({reportRef}){
  const [data,setData]=useState({ startDate:'2025-07-30', endDate:'2025-11-04', revenue:51855, km:43068, tolls:7338, avgConsumption:28.5, fuelPrice:1.35, driverPayPerDay:95, monthlyRate:2100, extraOverheadMonthly:900 });
  const days = useMemo(()=>daysBetweenInclusive(data.startDate,data.endDate),[data.startDate,data.endDate]);
  const liters = useMemo(()=> (data.km*(data.avgConsumption||0))/100, [data.km,data.avgConsumption]);
  const fuelCost = useMemo(()=> liters*(data.fuelPrice||0), [liters,data.fuelPrice]);
  const months = useMemo(()=> days/30, [days]);
  const driverCost = useMemo(()=> days*(data.driverPayPerDay||0), [days,data.driverPayPerDay]);
  const rateCost = useMemo(()=> months*(data.monthlyRate||0), [months,data.monthlyRate]);
  const overheadCost = useMemo(()=> months*(data.extraOverheadMonthly||0), [months,data.extraOverheadMonthly]);
  const directCosts = fuelCost + (data.tolls||0) + driverCost + rateCost;
  const totalCosts = directCosts + overheadCost;
  const profitBrut = (data.revenue||0) - directCosts;
  const profitNet = (data.revenue||0) - totalCosts;
  const perKm = (v)=> data.km ? v/data.km : 0;
  const perDay = (v)=> days ? v/days : 0;
  const percent=(a,b)=> b? (100*a/b):0;

  const barData=[
    {name:'€/km', Venit:perKm(data.revenue), Cost_direct:perKm(directCosts), Cost_total:perKm(totalCosts), Profit_brut:perKm(profitBrut), Profit_net:perKm(profitNet)},
    {name:'€/zi', Venit:perDay(data.revenue), Cost_direct:perDay(directCosts), Cost_total:perDay(totalCosts), Profit_brut:perDay(profitBrut), Profit_net:perDay(profitNet)},
  ];
  const costBreak=[
    {name:'Motorină', value:fuelCost},
    {name:'Toll-uri', value:data.tolls||0},
    {name:'Șofer', value:driverCost},
    {name:'Rată ansamblu', value:rateCost},
    {name:'Alte costuri', value:overheadCost},
  ];
  const kpi=[
    ['Zile în lucru', `${days} zile`],
    ['Km parcurși', `${data.km.toLocaleString('ro-RO')} km`],
    ['Consum estimat', `${Math.round(liters)} L`],
    ['Venit/km', `${perKm(data.revenue).toFixed(3)} €/km`],
    ['Cost/km (direct)', `${perKm(directCosts).toFixed(3)} €/km`],
    ['Profit/km (net)', `${perKm(profitNet).toFixed(3)} €/km`],
  ];
  const setField=(k,v)=> setData(d=>({...d,[k]:v}));

  return (<div>
    <h1 className='text-xl font-semibold mb-3'>Profit camion</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <h2 className='font-semibold mb-2'>Perioadă & volum</h2>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Data start</label><input type='date' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.startDate} onChange={e=>setField('startDate',e.target.value)} /></div>
          <div><label className='text-sm text-gray-300'>Data finală</label><input type='date' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.endDate} onChange={e=>setField('endDate',e.target.value)} /></div>
          <div><label className='text-sm text-gray-300'>Încasări (€)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.revenue} onChange={e=>setField('revenue',parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Km parcurși</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.km} onChange={e=>setField('km',parseFloat(e.target.value||0))} /></div>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <h2 className='font-semibold mb-2'>Costuri unitare</h2>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-300'>Consum (L/100km)</label><input type='number' step='0.1' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.avgConsumption} onChange={e=>setField('avgConsumption',parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Preț motorină (€/L)</label><input type='number' step='0.01' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.fuelPrice} onChange={e=>setField('fuelPrice',parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Toll-uri (€)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.tolls} onChange={e=>setField('tolls',parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Șofer (€/zi)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.driverPayPerDay} onChange={e=>setField('driverPayPerDay',parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Rată ansamblu (€/lună)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.monthlyRate} onChange={e=>setField('monthlyRate',parseFloat(e.target.value||0))} /></div>
          <div><label className='text-sm text-gray-300'>Alte costuri (€/lună)</label><input type='number' className='w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2' value={data.extraOverheadMonthly} onChange={e=>setField('extraOverheadMonthly',parseFloat(e.target.value||0))} /></div>
        </div>
      </div>
    </div>

    <div className='grid md:grid-cols-3 gap-4 mt-4'>
      {[['Costuri directe', currency(directCosts), `Cost/km: ${perKm(directCosts).toFixed(3)} €`],
        ['Profit brut', currency(profitBrut), `Marjă brută: ${(percent(profitBrut,data.revenue)).toFixed(1)}%`],
        ['Profit net', currency(profitNet), `Marjă netă: ${(percent(profitNet,data.revenue)).toFixed(1)}%`],
      ].map(([title,val,sub])=> (
        <div key={title} className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
          <div className='text-sm text-gray-300'>{title}</div>
          <div className='text-2xl font-bold'>{val}</div>
          <div className='text-sm text-gray-400'>{sub}</div>
        </div>
      ))}
    </div>

    <div className='grid md:grid-cols-3 gap-4 mt-4'>
      {kpi.map(([label,value])=> (
        <div key={label} className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
          <div className='text-sm text-gray-400'>{label}</div>
          <div className='text-xl font-bold mt-1'>{value}</div>
        </div>
      ))}
    </div>

    <div className='grid lg:grid-cols-3 gap-4 mt-4' ref={reportRef}>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand lg:col-span-2'>
        <h2 className='text-lg font-semibold mb-2'>Comparativ €/km și €/zi</h2>
        <div className='h-72 bg-neutral-900 border border-neutral-800 rounded-2xl p-3'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray='3 3'/>
              <XAxis dataKey='name'/><YAxis/><ReTooltip/><Legend/>
              <Bar dataKey='Venit'/><Bar dataKey='Cost_direct'/><Bar dataKey='Cost_total'/><Bar dataKey='Profit_brut'/><Bar dataKey='Profit_net'/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className='bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand'>
        <h2 className='text-lg font-semibold mb-2'>Defalcare costuri</h2>
        <div className='h-72 bg-neutral-900 border border-neutral-800 rounded-2xl p-3'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie data={costBreak} dataKey='value' nameKey='name' outerRadius={85}>
                {costBreak.map((_,i)=>(<Cell key={i}/>))}
              </Pie>
              <ReTooltip/><Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>);
}
