import React, { useMemo, useRef, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import html2pdf from "html2pdf.js";

const LOGO_URL = "/logo-proelite.png"; // logo PNG transparent local

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
      margin: [10, 10, 10, 10],
      filename: `raport-profit-${data.startDate}_${data.endDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    html2pdf().set(opt).from(pdfRef.current).save();
  }

  return (
    <div className="min-h-screen bg-[color:var(--brand-dark)] text-white">
      {/* Header negru + linie gri subtile */}
      <div className="bg-black border-b border-[#2d2d2d] sticky top-0 z-10 no-print">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Pro Elite Distribution" className="h-10 w-auto" />
            <div className="text-lg/6 font-semibold tracking-wide">Calculator profitabilitate camion</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={downloadPDF} className="px-4 py-2 rounded-xl bg-white text-black font-medium hover:opacity-90 shadow">
              Descarcă raport PDF (landscape)
            </button>
          </div>
        </div>
      </div>

      {/* Conținut */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <p className="text-gray-300 mb-4">Introdu datele și vezi KPI-urile. Raportul PDF are layout dedicat (landscape).</p>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand">
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

          <div className="bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand">
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

        {/* KPI + Profit cards on-screen */}
        <div className="grid md-grid-cols-3 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand">
            <div className="text-sm text-gray-300">Costuri directe</div>
            <div className="text-2xl font-bold text-brand-red">{currency(directCosts)}</div>
            <div className="text-sm text-gray-400">Cost/km: {perKm(directCosts).toFixed(3)} €</div>
          </div>
          <div className="bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand">
            <div className="text-sm text-gray-300">Profit brut</div>
            <div className="text-2xl font-bold text-emerald-400">{currency(profitBrut)}</div>
            <div className="text-sm text-gray-400">Marjă brută: {percent(profitBrut, data.revenue).toFixed(1)}%</div>
          </div>
          <div className="bg-[color:var(--brand-gray)] p-4 rounded-2xl shadow-brand">
            <div className="text-sm text-gray-300">Profit net</div>
            <div className="text-2xl font-bold text-emerald-400">{currency(profitNet)}</div>
            <div className="text-sm text-gray-400">Marjă netă: {percent(profitNet, data.revenue).toFixed(1)}%</div>
          </div>
        </div>

        {/* Hidden PDF layout (landscape) */}
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
          />
        </div>

        <footer className="text-center text-gray-400 text-sm mt-8">
          Cristian Mandoiu, Pro Elite Ditribution 2025
        </footer>
      </div>
    </div>
  );
}

/** PDF layout landscape: o singură pagină cu 2 coloane (rezumat + tabele) */
const PDFReport = React.forwardRef(function PDFReport(props, ref) {
  const { data, days, liters, fuelCost, months, directCosts, totalCostsWithOverhead,
    profitBrut, profitNet, perKm, perDay, percent } = props;

  const rowsFinance = [
    ["Încasări", data.revenue],
    ["Costuri directe", directCosts],
    ["Profit brut", profitBrut],
    ["Costuri totale", totalCostsWithOverhead],
    ["Profit net", profitNet],
    ["Marjă brută", percent(profitBrut, data.revenue).toFixed(1) + "%"],
    ["Marjă netă", percent(profitNet, data.revenue).toFixed(1) + "%"],
  ];

  const rowsOps = [
    ["Zile în lucru", days + " zile"],
    ["Kilometri", data.km.toLocaleString("ro-RO") + " km"],
    ["Consum estimat", Math.round(liters) + " L"],
    ["Venit/km", perKm(data.revenue).toFixed(3) + " €/km"],
    ["Cost/km (direct)", perKm(directCosts).toFixed(3) + " €/km"],
    ["Profit/km (net)", perKm(profitNet).toFixed(3) + " €/km"],
    ["Profit/zi (net)", perDay(profitNet).toFixed(0) + " €/zi"],
  ];

  return (
    <div ref={ref} className="pdf-root" style={{ padding: 8, width: '277mm', minHeight: '190mm' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ background:'#000', padding:'6px 10px', borderRadius:8 }}>
            <img src="/logo-proelite.png" alt="Pro Elite Distribution" style={{ height: 20 }} />
          </div>
          <div style={{ fontWeight:700, fontSize:16 }}>Raport profitabilitate camion</div>
        </div>
        <div className="small">Perioadă: {data.startDate} – {data.endDate}</div>
      </div>

      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <div style={{ flex:1 }}>
          <div className="h2">Rezumat financiar</div>
          <table className="table">
            <tbody>
              {rowsFinance.map(([k, v]) => (
                <tr key={k}><th>{k}</th><td>{typeof v === 'number' ? currency(v) : v}</td></tr>
              ))}
            </tbody>
          </table>

          <div className="h2">Indicatori operaționali</div>
          <table className="table">
            <tbody>
              {rowsOps.map(([k, v]) => (
                <tr key={k}><th>{k}</th><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ flex:1 }}>
          <div className="h2">Detaliu costuri</div>
          <table className="table">
            <thead><tr><th>Categoria</th><th>Suma</th></tr></thead>
            <tbody>
              <tr><td>Motorină</td><td>{currency(fuelCost)}</td></tr>
              <tr><td>Toll-uri</td><td>{currency((data.tolls || 0))}</td></tr>
              <tr><td>Șofer ({days} zile × {data.driverPayPerDay} €/zi)</td><td>{currency(days * data.driverPayPerDay)}</td></tr>
              <tr><td>Rată ansamblu (~{months.toFixed(1)} luni)</td><td>{currency(months * data.monthlyRate)}</td></tr>
              <tr><td>Alte costuri (~{months.toFixed(1)} luni)</td><td>{currency(months * data.extraOverheadMonthly)}</td></tr>
            </tbody>
          </table>

          <div className="small" style={{ marginTop: 8 }}>
            Notă: Valorile sunt estimative și depind de consum, preț motorină și taxe lunare.
          </div>
        </div>
      </div>

      <div style={{ textAlign:'center', fontSize:12, color:'#6b7280', marginTop:8 }}>
        Cristian Mandoiu, Pro Elite Ditribution 2025
      </div>
    </div>
  );
});
