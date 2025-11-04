import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

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

export default function App() {
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
    {
      name: "€/km",
      Venit: perKm(data.revenue || 0),
      Cost_direct: perKm(directCosts),
      Cost_total: perKm(totalCostsWithOverhead),
      Profit_brut: perKm(profitBrut),
      Profit_net: perKm(profitNet),
    },
    {
      name: "€/zi",
      Venit: perDay(data.revenue || 0),
      Cost_direct: perDay(directCosts),
      Cost_total: perDay(totalCostsWithOverhead),
      Profit_brut: perDay(profitBrut),
      Profit_net: perDay(profitNet),
    },
  ];

  const kpi = [
    { label: "Zile în lucru", value: days, suffix: "zile" },
    { label: "Km parcurși", value: data.km.toLocaleString("ro-RO"), suffix: "km" },
    { label: "Consum estimat", value: liters.toFixed(0), suffix: "L" },
    { label: "Venit/km", value: perKm(data.revenue).toFixed(3), suffix: "€/km" },
    { label: "Cost/km (direct)", value: perKm(directCosts).toFixed(3), suffix: "€/km" },
    { label: "Profit/km (net)", value: perKm(profitNet).toFixed(3), suffix: "€/km" },
  ];

  const currency = (v) => (isFinite(v) ? v.toLocaleString("ro-RO", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }) : "-");
  const currency2 = (v) => (isFinite(v) ? v.toLocaleString("ro-RO", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }) : "-");

  function setField(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Calculator profitabilitate camion</h1>
          <p className="text-gray-600 mt-1">Introdu datele operaționale și vezi instant KPI-urile, costurile și profitul.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">Perioadă & volum</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Data start</label>
                <input type="date" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.startDate} onChange={(e) => setField("startDate", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Data finală</label>
                <input type="date" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.endDate} onChange={(e) => setField("endDate", e.target.value)} max={todayISO} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Încasări totale (€)</label>
                <input type="number" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.revenue} onChange={(e) => setField("revenue", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Km parcurși</label>
                <input type="number" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.km} onChange={(e) => setField("km", parseFloat(e.target.value || 0))} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">Costuri unitare</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Consum mediu (L/100km)</label>
                <input type="number" step="0.1" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.avgConsumption} onChange={(e) => setField("avgConsumption", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Preț motorină (€/L)</label>
                <input type="number" step="0.01" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.fuelPrice} onChange={(e) => setField("fuelPrice", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Taxe drum (toll-uri) (€)</label>
                <input type="number" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.tolls} onChange={(e) => setField("tolls", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Plată șofer (€/zi)</label>
                <input type="number" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.driverPayPerDay} onChange={(e) => setField("driverPayPerDay", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Rată ansamblu (€/lună)</label>
                <input type="number" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.monthlyRate} onChange={(e) => setField("monthlyRate", parseFloat(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Alte costuri (€/lună)</label>
                <input type="number" className="w-full mt-1 border rounded-xl px-3 py-2" value={data.extraOverheadMonthly} onChange={(e) => setField("extraOverheadMonthly", parseFloat(e.target.value || 0))} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {kpi.map((k) => (
            <div key={k.label} className="bg-white p-4 rounded-2xl shadow">
              <div className="text-sm text-gray-500">{k.label}</div>
              <div className="text-2xl font-bold mt-1">
                {k.value} <span className="text-base font-medium text-gray-500">{k.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-2xl shadow lg:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Venituri, costuri și profit</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-sm text-gray-600">Costuri directe</div>
                <div className="text-2xl font-bold">{currency(directCosts)}</div>
                <div className="text-sm text-gray-600 mt-1">Cost/km: {perKm(directCosts).toFixed(3)} €</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-sm text-gray-600">Costuri totale (cu alte costuri)</div>
                <div className="text-2xl font-bold">{currency(totalCostsWithOverhead)}</div>
                <div className="text-sm text-gray-600 mt-1">Cost/km: {perKm(totalCostsWithOverhead).toFixed(3)} €</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-sm text-gray-600">Profit brut</div>
                <div className="text-2xl font-bold">{currency(profitBrut)}</div>
                <div className="text-sm text-gray-600 mt-1">Marjă brută: {percent(profitBrut, data.revenue).toFixed(1)}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-sm text-gray-600">Profit net</div>
                <div className="text-2xl font-bold">{currency(profitNet)}</div>
                <div className="text-sm text-gray-600 mt-1">Marjă netă: {percent(profitNet, data.revenue).toFixed(1)}%</div>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="h-72 bg-white border rounded-2xl p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ReTooltip formatter={(v) => currency2(v)} />
                    <Legend />
                    <Bar dataKey="Venit" />
                    <Bar dataKey="Cost_direct" />
                    <Bar dataKey="Cost_total" />
                    <Bar dataKey="Profit_brut" />
                    <Bar dataKey="Profit_net" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-72 bg-white border rounded-2xl p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={costBreakdown} dataKey="value" nameKey="name" outerRadius={85}>
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} />
                      ))}
                    </Pie>
                    <ReTooltip formatter={(v) => currency2(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">Detaliu costuri</h2>
            <ul className="space-y-2">
              <li className="flex justify-between"><span>Motorină ({liters.toFixed(0)} L)</span><span>{currency(fuelCost)}</span></li>
              <li className="flex justify-between"><span>Toll-uri</span><span>{currency(data.tolls || 0)}</span></li>
              <li className="flex justify-between"><span>Șofer ({days} zile × {currency2(data.driverPayPerDay)}/zi)</span><span>{currency(driverCost)}</span></li>
              <li className="flex justify-between"><span>Rată ansamblu (~{months.toFixed(1)} luni)</span><span>{currency(rateCost)}</span></li>
              <li className="flex justify-between"><span>Alte costuri (~{months.toFixed(1)} luni)</span><span>{currency(overheadCost)}</span></li>
            </ul>
            <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
              <span>Total costuri</span>
              <span>{currency(totalCostsWithOverhead)}</span>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
              <p>
                <strong>Sfaturi:</strong> testează sensibilitatea prin modificarea consumului, prețului motorinei și a costurilor lunare.
                Vezi cum se schimbă profitul/km și marjele.
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-6">
          Făcut pentru scenariul tău: 30.07 → 04.11, încasări 51.855 €, 43.068 km, toll-uri 7.338 €, consum 28,5 L/100km, șofer 95 €/zi, rată 2.100 €/lună.
        </footer>
      </div>
    </div>
  );
}
