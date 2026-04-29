/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Calculator, 
  Battery, 
  History, 
  MessageSquare, 
  LayoutDashboard,
  Plus,
  Trash2,
  Lightbulb,
  ArrowRight,
  Loader2,
  TrendingUp,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

import { Appliance, EstimatedUse, LogEntry } from './types';
import { DEFAULT_APPLIANCES } from './constants';
import { getEnergyAdvice, getBackupGuidance } from './services/geminiService';

// --- Components ---

const Card = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <div id={id} className={`bg-gray-50/50 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden ${className}`}>
    {children}
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, id }: any) => (
  <button
    id={id}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-500/20' 
        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    <span className="text-[10px] uppercase tracking-widest font-black">{label}</span>
  </button>
);

// --- Sub-sections ---

const Dashboard = ({ demand, logs }: { demand: number, logs: LogEntry[] }) => {
  const lastLogs = logs.slice(-7);
  const avgKwh = logs.length > 0 ? (logs.reduce((acc, l) => acc + l.kwh, 0) / logs.length).toFixed(1) : 0;

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic text-blue-600">Diagnostics</h2>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black mt-2">Real-time Performance Metrics</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Network Frequency</p>
          <p className="text-sm font-mono text-blue-600 font-bold">60.01 HZ // SYNCHRONIZED</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-12 xl:col-span-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-2 font-black">Current System Load</p>
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-[100px] md:text-[160px] font-black leading-none tracking-tighter text-gray-950">
              {demand > 1000 ? (demand / 1000).toFixed(2) : demand}
            </h2>
            <span className="text-5xl font-black text-blue-600 uppercase italic">
              {demand > 1000 ? 'kW' : 'W'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 bg-blue-50 border-none">
              <p className="text-[10px] uppercase font-black tracking-widest text-blue-400 mb-2">Rolling Average</p>
              <p className="text-4xl font-black italic text-blue-900">{avgKwh} <span className="text-sm not-italic opacity-40 uppercase">kWh / Day</span></p>
            </Card>
            <Card className="p-8 bg-emerald-50 border-none">
              <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-2">Efficiency Rating</p>
              <p className="text-4xl font-black italic text-emerald-900">82% <span className="text-sm not-italic opacity-40 uppercase font-mono ml-2">PEAK</span></p>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          <Card className="p-8 bg-gray-950 text-white border-none shadow-2xl h-full flex flex-col justify-between min-h-[300px]">
            <div>
              <p className="text-xs uppercase font-black tracking-[0.3em] mb-2 text-gray-500">Backup Potency</p>
              <h3 className="text-6xl font-black italic text-blue-400">94%</h3>
            </div>
            <div className="space-y-4 my-8">
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-[10px] font-black uppercase text-gray-400">Control Mode</span>
                <span className="text-[10px] font-mono font-bold tracking-widest">ECO-DYNAMIC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-black uppercase text-gray-400">Infrastructure</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
              </div>
            </div>
            <button className="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
              Secure Local Isolation
            </button>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <Card className="p-10 h-[480px] bg-white">
            <h3 className="text-[10px] uppercase tracking-widest font-black mb-10 text-gray-400">Energy Trajectory (7-Day)</h3>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={logs}>
                  <defs>
                    <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      backgroundColor: '#ffffff',
                      border: 'none',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      color: '#020617',
                      fontSize: '12px',
                      fontWeight: 900,
                      padding: '16px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="kwh" 
                    stroke="#2563eb" 
                    fillOpacity={1} 
                    fill="url(#colorKwh)" 
                    strokeWidth={6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="p-10 bg-white">
            <h3 className="text-[10px] uppercase tracking-widest font-black mb-10 text-gray-400">Observation Chronology</h3>
            <div className="space-y-6">
              {lastLogs.reverse().map((log) => (
                <div key={log.id} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all cursor-default">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-tight mb-1">{log.date}</span>
                    <span className="text-sm text-gray-900 font-bold italic tracking-tight leading-snug">"{log.habit}"</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600 font-mono tracking-tighter">{log.kwh}</span>
                    <span className="block text-[8px] font-black uppercase text-gray-400">units</span>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-relaxed">System Idle // No Data Ingress</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


const DemandCalculator = ({ estimatedUses, setEstimatedUses }: { estimatedUses: EstimatedUse[], setEstimatedUses: any }) => {
  const [selectedAppliance, setSelectedAppliance] = useState(DEFAULT_APPLIANCES[0].id);
  const [hours, setHours] = useState(1);
  const [qty, setQty] = useState(1);

  const addUsage = (e: React.FormEvent) => {
    e.preventDefault();
    const newUse: EstimatedUse = { applianceId: selectedAppliance, hoursPerDay: hours, quantity: qty };
    setEstimatedUses([...estimatedUses, newUse]);
  };

  const removeUsage = (index: number) => {
    const next = [...estimatedUses];
    next.splice(index, 1);
    setEstimatedUses(next);
  };

  const totalDemand = estimatedUses.reduce((acc, use) => {
    const app = DEFAULT_APPLIANCES.find(a => a.id === use.applianceId);
    return acc + (app ? app.powerWatts * use.quantity : 0);
  }, 0);

  const dailyKwh = estimatedUses.reduce((acc, use) => {
    const app = DEFAULT_APPLIANCES.find(a => a.id === use.applianceId);
    return acc + (app ? (app.powerWatts * use.hoursPerDay * use.quantity) / 1000 : 0);
  }, 0);

  return (
    <div className="space-y-12">
      <header className="border-b border-gray-100 pb-8">
        <h2 className="text-5xl font-black tracking-tighter uppercase italic text-blue-600">Inventory</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black mt-2">Quantitative Loadout Profiling</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="p-10 lg:h-fit bg-gray-950 text-white border-none shadow-2xl">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black mb-8 text-gray-500">Asset Ingress</h3>
          <form onSubmit={addUsage} className="space-y-8">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-3 block">Energy Consumer</label>
              <select 
                value={selectedAppliance} 
                onChange={(e) => setSelectedAppliance(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-sm text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                {DEFAULT_APPLIANCES.map(app => (
                  <option key={app.id} value={app.id} className="bg-gray-900">{app.name} ({app.powerWatts}W)</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-3 block">Operational Hr</label>
                <input 
                  type="number" 
                  min="1" max="24"
                  value={hours} 
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-sm text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-3 block">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-sm text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
            >
              <Plus size={16} strokeWidth={3} /> Commit to Profile
            </button>
          </form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10 bg-white">
            <h3 className="text-[10px] uppercase tracking-widest font-black mb-8 text-gray-400">Consumption Hierarchy</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="pb-5 text-[10px] uppercase text-gray-400 font-black tracking-widest">Component</th>
                    <th className="pb-5 text-[10px] uppercase text-gray-400 font-black tracking-widest">Density</th>
                    <th className="pb-5 text-[10px] uppercase text-gray-400 font-black tracking-widest text-right">Instantaneous Load</th>
                    <th className="pb-5 text-[10px] uppercase text-gray-400 font-black tracking-widest text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {estimatedUses.map((use, i) => {
                    const app = DEFAULT_APPLIANCES.find(a => a.id === use.applianceId);
                    return (
                      <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-6 text-sm text-gray-950 font-black tracking-tight">{app?.name}</td>
                        <td className="py-6 text-sm text-gray-400 font-mono italic font-bold">x{use.quantity} Units</td>
                        <td className="py-6 text-sm text-right font-black text-blue-600 italic">
                          {app ? app.powerWatts * use.quantity : 0}W
                        </td>
                        <td className="py-6 text-right">
                          <button 
                            onClick={() => removeUsage(i)}
                            className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {estimatedUses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-32 text-center text-gray-300 italic font-black uppercase text-[10px] tracking-widest">Inert Profile // Awaiting Asset Input</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-white rounded-3xl border-l-[16px] border-blue-600 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <Zap size={80} fill="currentColor" className="text-blue-600" />
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-3">Culminating Peak Demand</p>
              <p className="text-5xl font-black text-gray-950 tracking-tighter">{totalDemand} <span className="opacity-20 text-2xl italic uppercase">Watts</span></p>
            </div>
            <div className="p-10 bg-white rounded-3xl border-l-[16px] border-emerald-500 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <TrendingUp size={80} className="text-emerald-500" />
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-3">Accumulated Daily Cycle</p>
              <p className="text-5xl font-black text-gray-950 tracking-tighter">{dailyKwh.toFixed(2)} <span className="opacity-20 text-2xl italic uppercase">kWh</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackupAdvisor = ({ totalDemand }: { totalDemand: number }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState(4);

  const getGuidance = async () => {
    setLoading(true);
    const res = await getBackupGuidance(totalDemand, hours);
    setAdvice(res);
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      <header className="border-b border-gray-100 pb-8">
        <h2 className="text-5xl font-black tracking-tighter uppercase italic text-blue-600">Redundancy</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black mt-2">Strategic Power Redundancy Analysis</p>
      </header>

      <Card className="p-16 max-w-2xl mx-auto border-t-[20px] border-t-blue-600 bg-white shadow-3xl">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="p-10 bg-gray-50 text-blue-600 rounded-full border border-gray-100 shadow-inner group transition-transform hover:scale-110">
            <Battery size={80} strokeWidth={1} className={loading ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="text-4xl font-black italic text-gray-950 uppercase tracking-tighter">Topology Configuration</h3>
            <p className="text-[10px] font-black text-gray-400 mt-3 uppercase tracking-[0.3em]">Based on peak load: <span className="text-blue-600">{totalDemand}W</span></p>
          </div>

          <div className="w-full max-w-sm text-left bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-6 block">Autonomy Target (Hours)</label>
            <input 
              type="range" min="1" max="24" value={hours} 
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-6 text-[10px] font-mono font-black text-blue-600 uppercase tracking-[0.2em]">
              <span>{hours} HOURS</span>
              <span>{((totalDemand * hours) / 1000).toFixed(1)} kWh RESERVES</span>
            </div>
          </div>

          <button 
            onClick={getGuidance}
            disabled={loading || totalDemand === 0}
            className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-30 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <TrendingUp size={20} strokeWidth={3} />}
            Initialize Strategy Engine
          </button>

          {totalDemand === 0 && (
            <p className="text-[10px] text-red-500 italic font-black uppercase tracking-widest animate-bounce">Critical Error: Null Demand Profile</p>
          )}

          {advice && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-left bg-gray-950 rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <ShieldCheck size={40} className="text-emerald-400" />
              </div>
              <div className="whitespace-pre-wrap text-emerald-50 text-sm leading-relaxed font-sans font-bold">
                {advice}
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

const ConsumptionLogger = ({ logs, setLogs }: { logs: LogEntry[], setLogs: any }) => {
  const [kwh, setKwh] = useState(0.0);
  const [habit, setHabit] = useState('');

  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      kwh,
      habit
    };
    setLogs([...logs, newLog]);
    setKwh(0);
    setHabit('');
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-12">
      <header className="border-b border-gray-100 pb-8">
        <h2 className="text-5xl font-black tracking-tighter uppercase italic text-blue-600">Archives</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black mt-2">Behavioral Load Documentation</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <Card className="p-10 h-fit border-l-[16px] border-blue-600 bg-white">
          <h3 className="text-[10px] uppercase tracking-widest font-black mb-8 text-gray-400">Diagnostic Ingress</h3>
          <form onSubmit={addLog} className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Energy Units (kWh)</label>
              <input 
                type="number" step="0.1" value={kwh} 
                onChange={(e) => setKwh(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm text-gray-950 font-black focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Behavioral Observation</label>
              <textarea 
                placeholder="LOAD SHEDDING MITIGATION..."
                value={habit} 
                onChange={(e) => setHabit(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm text-gray-950 font-black h-40 resize-none focus:ring-2 focus:ring-blue-600 outline-none placeholder:text-gray-300"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white rounded-2xl py-5 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
            >
              <Save size={16} strokeWidth={3} /> Update Records
            </button>
          </form>
        </Card>

        <div className="lg:col-span-3">
          <Card className="p-0 border-gray-100 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Timestamp</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Volume</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Observation Narrative</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-6 text-xs font-mono text-gray-400 uppercase font-black tracking-tighter">{log.date}</td>
                      <td className="p-6 text-sm font-black text-gray-950 italic">{log.kwh} <span className="opacity-20 text-[10px] not-italic">kWh</span></td>
                      <td className="p-6 text-sm text-gray-600 font-bold leading-relaxed">"{log.habit}"</td>
                      <td className="p-6 text-right">
                        <button onClick={() => deleteLog(log.id)} className="text-gray-200 hover:text-red-500 transition-colors p-2">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-40 text-center text-gray-200 font-black uppercase tracking-widest italic opacity-50">Null Data Set // No Records Persistent</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AIAssistant = ({ context }: { context: string }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const res = await getEnergyAdvice(context);
    setAdvice(res);
    setLoading(false);
  };

  return (
    <div className="space-y-12 text-gray-950">
      <header className="border-b border-gray-100 pb-8">
        <h2 className="text-5xl font-black tracking-tighter uppercase italic text-blue-600">Guidance</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black mt-2">AI-Driven Conservation Protocol</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-10">
        <Card className="p-16 bg-blue-600 text-white border-none shadow-3xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="p-8 bg-white/10 rounded-[40px] backdrop-blur-xl border border-white/20 shadow-2xl">
              <MessageSquare size={48} strokeWidth={3} className="text-white" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black tracking-[0.4em] mb-3 text-blue-200">Advisory Component</p>
              <h3 className="text-4xl font-black italic tracking-tighter leading-none mb-4">Strategic Efficiency Vector Analysis.</h3>
              <p className="text-sm font-bold text-blue-100 max-w-lg mb-8">Deploying neural logic to synthesize a personalized energy mitigation roadmap based on local parameters.</p>
              
              <button 
                onClick={fetchAdvice}
                disabled={loading}
                className="bg-white text-blue-600 px-12 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4 mx-auto md:mx-0 group"
              >
                {loading ? <Loader2 className="animate-spin" /> : <TrendingUp size={20} strokeWidth={3} />}
                Execute Protocol
              </button>
            </div>
          </div>
        </Card>

        <AnimatePresence>
          {advice && (
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <Card className="p-12 border-none bg-white shadow-2xl">
                <div className="prose prose-blue max-w-none">
                  <div className="whitespace-pre-wrap font-sans font-black leading-relaxed text-lg text-gray-900 tracking-tight">
                    {advice}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [estimatedUses, setEstimatedUses] = useState<EstimatedUse[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('wattswise_logs');
    return saved ? JSON.parse(saved) : [
      { id: '1', date: '2024-04-22', kwh: 12.5, habit: 'AC left on overnight' },
      { id: '2', date: '2024-04-23', kwh: 10.2, habit: 'Managed to keep lights off in afternoon' },
      { id: '3', date: '2024-04-24', kwh: 14.1, habit: 'Heavy laundry day' },
      { id: '4', date: '2024-04-25', kwh: 8.8, habit: 'Optimized cooling settings' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('wattswise_logs', JSON.stringify(logs));
  }, [logs]);

  const totalDemand = estimatedUses.reduce((acc, use) => {
    const app = DEFAULT_APPLIANCES.find(a => a.id === use.applianceId);
    return acc + (app ? app.powerWatts * use.quantity : 0);
  }, 0);

  const contextStr = `The household has a peak demand of ${totalDemand}W. ${estimatedUses.length} appliances registered. Recent daily logs: ${logs.slice(-3).map(l => l.kwh + 'kWh').join(', ')}.`;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard demand={totalDemand} logs={logs} />;
      case 'calculator': return <DemandCalculator estimatedUses={estimatedUses} setEstimatedUses={setEstimatedUses} />;
      case 'backup': return <BackupAdvisor totalDemand={totalDemand} />;
      case 'logger': return <ConsumptionLogger logs={logs} setLogs={setLogs} />;
      case 'ai': return <AIAssistant context={contextStr} />;
      default: return <Dashboard demand={totalDemand} logs={logs} />;
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-950 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-72 border-r border-gray-100 flex flex-col p-10 hidden md:flex bg-gray-50/30">
        <div className="flex items-center gap-3 mb-16 px-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
            <Zap size={28} fill="white" strokeWidth={0} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-gray-950 leading-none">Ampere</h1>
        </div>

        <nav className="flex-1 space-y-4">
          <SidebarItem id="nav-dashboard" icon={LayoutDashboard} label="Real-Time Data" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem id="nav-calculator" icon={Calculator} label="Asset Profile" active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} />
          <SidebarItem id="nav-backup" icon={Battery} label="Reserve Strategy" active={activeTab === 'backup'} onClick={() => setActiveTab('backup')} />
          <SidebarItem id="nav-logger" icon={History} label="Behavioral History" active={activeTab === 'logger'} onClick={() => setActiveTab('logger')} />
          <SidebarItem id="nav-ai" icon={MessageSquare} label="AI Consultant" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
        </nav>

        <div className="mt-auto p-6 bg-gray-950 rounded-[32px] shadow-2xl">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-3">Efficiency Index</p>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase text-emerald-400 italic">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse"></div>
            System Optimized
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Nav Top Bar */}
        <div className="md:hidden flex items-center justify-between p-8 border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Zap size={22} fill="white" strokeWidth={0} />
             </div>
             <span className="font-black text-2xl uppercase italic tracking-tighter text-gray-950">Ampere</span>
          </div>
          <button onClick={() => setActiveTab('dashboard')} className="p-2 text-gray-400"><LayoutDashboard size={28} /></button>
        </div>

        <div className="max-w-6xl mx-auto p-10 md:p-16 lg:p-20">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-8 left-8 right-8 h-20 bg-white/90 backdrop-blur-3xl border border-gray-100 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] flex items-center justify-around px-4 z-50">
        {[
          { id: 'dashboard', icon: LayoutDashboard },
          { id: 'calculator', icon: Calculator },
          { id: 'backup', icon: Battery },
          { id: 'logger', icon: History },
          { id: 'ai', icon: MessageSquare },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)} 
            className={`p-5 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'text-blue-600 bg-blue-50 scale-110 shadow-sm' 
                : 'text-gray-300 active:text-gray-900'
            }`}
          >
            <item.icon size={24} strokeWidth={activeTab === item.id ? 3 : 2} />
          </button>
        ))}
      </nav>
    </div>
  );
}
