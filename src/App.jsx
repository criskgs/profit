import React, { useMemo, useRef, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import html2pdf from "html2pdf.js";

const LOGO_URL = "https://proelitedistribution.ro/wp-content/uploads/2025/10/proelite-logo-2-scaled.png";

function daysBetweenInclusive(startISO, endISO) {
  if (!startISO || !endISO) return 0;
  const start = new Date(startISO);
  const end = new Date(endISO);
  start.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);
  const ms = end - start;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(days, 0);
}

function currency(v, frac=0) {
  return isFinite(v) ? v.toLocaleString("ro-RO", { style: "currency", currency: "EUR", maximumFractionDigits: frac }) : "-";
}

export default function App() {
  const pdfRef = useRef(null);
  const todayISO = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState({
    startDate: "2025-07-30",
    endDate: "2025-11-04",
    revenue: 51855,
    km: 43068,
    tolls: 7338,
    avgConsumption: 28.5,
    fuelPrice: 1.35,
    driverPayPerDay: 95,
    monthlyRate: 2100,
    extraOverheadMonthly: 900,
  });

  const days = useMemo(() => daysBetweenInclusive(data.startDate, data.endDate), [data.startDate, data.endDate]);
  const liters = useMemo(() => (data.km * (data.avgConsumption || 0)) / 100, [data.km, data.avgConsumption]);
  const fuelCost = useMemo(() => liters * (data.fuelPrice || 0), [liters, data.fuelPrice]);
  const months = useMemo(() => days / 30, [days]);
  const driverCost = useMemo(() => days * (data.driverPayPerDay || 0), [days, data.driverPayPerDay]);
  const rateCost = useMemo(() => months * (data.monthlyRate || 0), [months, data.monthlyRate]);
  const overheadCost = useMemo(() => months * (data.extraOverheadMonthly || 0), [months, data.extraOverheadMonthly]);

  const directCosts = fuelCost + (data.tolls || 0) + driverCost + rateCost;
  const totalCostsWithOverhead = directCosts + overheadCost;

  const profitBrut = (data.revenue || 0) - directCosts;
  const profitNet = (data.revenue || 0) - totalCostsWithOverhead;

  const perKm = (val) => (data.km ? val / data.km : 0);
  const perDay = (val) => (days ? val / days : 0);
  const percent = (num, den) => (den ? (100 * num) / den : 0);

  const costBreakdown = [
    { name: "Motorină", value: fuelCost },
    { name: "Toll-uri", value: data.tolls || 0 },
    { name: "Șofer", value: driverCost },
    { name: "Rată ansamblu", value: rateCost },
    { name: "Alte costuri", value: overheadCost },
  ];

  const barData = [
    { name: "€/km",
      Venit: perKm(data.revenue || 0),
      Cost_direct: perKm(directCosts),
      Cost_total: perKm(totalCostsWithOverhead),
      Profit_brut: perKm(profitBrut),
      Profit_net: perKm(profitNet) },
    { name: "€/zi",
      Venit: perDay(data.revenue || 0),
      Cost_direct: perDay(directCosts),
      Cost_total: perDay(totalCostsWithOverhead),
      Profit_brut: perDay(profitBrut),
      Profit_net: perDay(profitNet) },
  ];

  function setField(field, value) { setData((d) => ({ ...d, [field]: value })); }

  function downloadPDF() {
    const opt = {
      margin: 10,
      filename: `raport-profit-${data.startDate}_${data.endDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    html2pdf().set(opt).from(pdfRef.current).save();
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-red to-brand-redLight sticky top-0 z-10 no-print">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Pro Elite Distribution" className="h-10 w-auto drop-shadow" />
            <div className="text-lg/6 font-semibold tracking-wide">Calculator profitabilitate camion</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={downloadPDF} className="px-4 py-2 rounded-xl bg-white text-black font-medium hover:opacity-90 shadow">
              Descarcă raport PDF
            </button>
          </div>
        </div>
      </div>

      {/* On-screen app (same as înainte, scurtat pentru claritate) */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <p className="text-gray-300 mb-4">Introdu datele și vezi KPI-urile. PDF-ul are layout separat, optimizat pentru print.</p>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-brand-gray p-4 rounded-2xl shadow-brand">
            <h2 className="text-xl font-semibold mb-3">Perioadă & volum</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300">Data start</label>
                <input type="date" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.startDate} onChange={(e) => setField("startDate", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Data finală</label>
                <input type="date" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.endDate} onChange={(e) => setField("endDate", e.target.value)} max={todayISO} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Încasări totale (€)</label>
                <input type="number" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.revenue} onChange={(e) => setField("revenue", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Km parcurși</label>
                <input type="number" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.km} onChange={(e) => setField("km", parseFloat(e.target.value || 0))} />
              </div>
            </div>
          </div>

          <div className="bg-brand-gray p-4 rounded-2xl shadow-brand">
            <h2 className="text-xl font-semibold mb-3">Costuri unitare</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300">Consum mediu (L/100km)</label>
                <input type="number" step="0.1" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.avgConsumption} onChange={(e) => setField("avgConsumption", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Preț motorină (€/L)</label>
                <input type="number" step="0.01" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.fuelPrice} onChange={(e) => setField("fuelPrice", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Taxe drum (toll-uri) (€)</label>
                <input type="number" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.tolls} onChange={(e) => setField("tolls", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Plată șofer (€/zi)</label>
                <input type="number" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.driverPayPerDay} onChange={(e) => setField("driverPayPerDay", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Rată ansamblu (€/lună)</label>
                <input type="number" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.monthlyRate} onChange={(e) => setField("monthlyRate", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Alte costuri (€/lună)</label>
                <input type="number" className="w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2" value={data.extraOverheadMonthly} onChange={(e) => setField("extraOverheadMonthly", parseFloat(e.target.value || 0))} />
              </div>
            </div>
          </div>
        </div>

        {/* Hidden PDF report layout */}
        <div className="hidden">
          <PDFReport
            ref={pdfRef}
            data={data}
            days={days}
            liters={liters}
            fuelCost={fuelCost}
            months={months}
            directCosts={directCosts}
            totalCostsWithOverhead={totalCostsWithOverhead}
            profitBrut={profitBrut}
            profitNet={profitNet}
            perKm={perKm}
            perDay={perDay}
            percent={percent}
            costBreakdown={costBreakdown}
          />
        </div>

        {/* Live charts (screen only) */}
        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-brand-gray p-4 rounded-2xl shadow-brand lg:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Comparativ €/km și €/zi</h2>
            <div className="h-72 bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip formatter={(v) => currency(v, 2)} />
                  <Legend />
                  <Bar dataKey="Venit" />
                  <Bar dataKey="Cost_direct" />
                  <Bar dataKey="Cost_total" />
                  <Bar dataKey="Profit_brut" />
                  <Bar dataKey="Profit_net" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-brand-gray p-4 rounded-2xl shadow-brand">
            <h2 className="text-xl font-semibold mb-3">Defalcare costuri</h2>
            <div className="h-72 bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costBreakdown} dataKey="value" nameKey="name" outerRadius={85}>
                    {costBreakdown.map((entry, index) => (<Cell key={index} />))}
                  </Pie>
                  <ReTooltip formatter={(v) => currency(v, 2)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-400 text-sm mt-8">
          Cristian Mandoiu, Pro Elite Ditribution 2025
        </footer>
      </div>
    </div>
  );
}

/** PDF-only report component (white A4, tables, page breaks) */
const PDFReport = React.forwardRef(function PDFReport(props, ref) {
  const { data, days, liters, fuelCost, months, directCosts, totalCostsWithOverhead,
    profitBrut, profitNet, perKm, perDay, percent, costBreakdown } = props;

  return (
    <div ref={ref} className="pdf-root" style={{ padding: 12 }}>
      {/* Page 1: Header + Summary */}
      <div className="page">
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
          <img src={LOGO_URL} alt="Pro Elite Distribution" style={{ height: 36 }} />
          <div style={{ fontWeight:700, fontSize:16 }}>Raport profitabilitate camion</div>
        </div>
        <div className="small">Perioadă: {data.startDate} – {data.endDate}</div>

        <div className="h2">Rezumat financiar</div>
        <table className="table">
          <tbody>
            <tr><th>Încasări</th><td>{currency(data.revenue)}</td></tr>
            <tr><th>Costuri directe</th><td>{currency(directCosts)}</td></tr>
            <tr><th>Profit brut</th><td>{currency(profitBrut)}</td></tr>
            <tr><th>Costuri totale (cu alte costuri)</th><td>{currency(totalCostsWithOverhead)}</td></tr>
            <tr><th>Profit net</th><td>{currency(profitNet)}</td></tr>
            <tr><th>Marjă brută</th><td>{percent(profitBrut, data.revenue).toFixed(1)}%</td></tr>
            <tr><th>Marjă netă</th><td>{percent(profitNet, data.revenue).toFixed(1)}%</td></tr>
          </tbody>
        </table>

        <div className="h2">Indicatori operaționali</div>
        <table className="table">
          <tbody>
            <tr><th>Zile în lucru</th><td>{days} zile</td></tr>
            <tr><th>Kilometri</th><td>{data.km.toLocaleString("ro-RO")} km</td></tr>
            <tr><th>Consum estimat</th><td>{Math.round(liters)} L</td></tr>
            <tr><th>Venit/km</th><td>{perKm(data.revenue).toFixed(3)} €/km</td></tr>
            <tr><th>Cost/km (direct)</th><td>{perKm(directCosts).toFixed(3)} €/km</td></tr>
            <tr><th>Profit/km (net)</th><td>{perKm(profitNet).toFixed(3)} €/km</td></tr>
            <tr><th>Profit/zi (net)</th><td>{perDay(profitNet).toFixed(0)} €/zi</td></tr>
          </tbody>
        </table>
      </div>

      {/* Page 2: Cost breakdown */}
      <div className="page">
        <div className="h2">Detaliu costuri</div>
        <table className="table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Suma</th>
              <th>Pondere</th>
            </tr>
          </thead>
          <tbody>
            {costBreakdown.map((c) => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td>{currency(c.value)}</td>
                <td>{((c.value / (directCosts + (data.extraOverheadMonthly ? (months * data.extraOverheadMonthly) : 0))) * 100 || 0).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }} className="small">
          Notă: Valorile sunt estimative și depind de consum, preț motorină și taxe lunare.
        </div>
      </div>

      {/* Footer on last page */}
      <div style={{ textAlign:'center', fontSize:12, color:'#6b7280', marginTop:8 }}>
        Cristian Mandoiu, Pro Elite Ditribution 2025
      </div>
    </div>
  );
});
