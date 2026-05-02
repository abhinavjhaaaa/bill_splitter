import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Moon, Sun, X, Plus, Trash2, Users, DollarSign, Zap,
  ArrowRight, CheckCircle, AlertCircle, Loader2, Wallet,
  ReceiptText, TrendingUp, Clock, Sparkles, ArrowLeft,
  UserPlus, BarChart2, Upload, Home, ScanLine, Brain,
  ChevronRight, FileImage, Shield, RefreshCw, Download
} from "lucide-react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#04091a;--bg2:#07102a;--bg3:#0c1836;
  --glass:rgba(255,255,255,0.042);--glass2:rgba(255,255,255,0.08);
  --border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.14);
  --text:#dde9ff;--text2:#6a85b8;--text3:#3d5278;
  --teal:#00d4aa;--teal2:#00b894;--amber:#f59e0b;
  --danger:#ff4d6d;--success:#10b981;--purple:#8b5cf6;
  --font-d:'Syne',sans-serif;--font-b:'DM Sans',system-ui,sans-serif;
  --r:16px;--rl:24px;
}
.lm{
  --bg:#f0f5ff;--bg2:#ffffff;--bg3:#e4ecff;
  --glass:rgba(0,0,0,0.03);--glass2:rgba(0,0,0,0.06);
  --border:rgba(0,0,0,0.08);--border2:rgba(0,0,0,0.14);
  --text:#091428;--text2:#435e8a;--text3:#8aa4c8;
  --teal:#0891b2;--teal2:#0e7490;--amber:#d97706;
}
body{background:var(--bg);color:var(--text);font-family:var(--font-b);-webkit-font-smoothing:antialiased;line-height:1.6}
@keyframes fu{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes sc{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes sp{to{transform:rotate(360deg)}}
@keyframes ti{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
@keyframes sh{0%{background-position:-800px 0}100%{background-position:800px 0}}
@keyframes orb{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(28px,-18px) scale(1.06)}66%{transform:translate(-18px,14px) scale(0.94)}}
@keyframes pls{0%,100%{opacity:1}50%{opacity:0.4}}
.au{animation:fu .65s cubic-bezier(.16,1,.3,1) both}
.ai{animation:fi .4s ease both}
.sc{animation:sc .5s cubic-bezier(.16,1,.3,1) both}
.af{animation:fl 4s ease-in-out infinite}
.spin{animation:sp 1s linear infinite}
.pls{animation:pls 2s ease infinite}
.d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}
.d4{animation-delay:.24s}.d5{animation-delay:.3s}.d6{animation-delay:.36s}
.glass{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border)}
.glass2{background:var(--glass2);backdrop-filter:blur(20px);border:1px solid var(--border2)}
.gt{background:linear-gradient(135deg,var(--teal) 0%,var(--purple) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.btn-p{background:linear-gradient(135deg,var(--teal),#0891b2);color:#fff;border:none;cursor:pointer;font-family:var(--font-b);font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);box-shadow:0 4px 24px rgba(0,212,170,.22)}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,212,170,.38)}
.btn-p:active{transform:translateY(0)}
.btn-g{background:var(--glass);border:1px solid var(--border);color:var(--text);cursor:pointer;font-family:var(--font-b);font-weight:500;transition:all .2s}
.btn-g:hover{background:var(--glass2);border-color:var(--border2)}
.btn-d{background:rgba(255,77,109,.1);border:1px solid rgba(255,77,109,.22);color:#ff4d6d;cursor:pointer;font-family:var(--font-b);font-weight:500;transition:all .2s}
.btn-d:hover{background:rgba(255,77,109,.18)}
.btn-a{background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.25);color:var(--purple);cursor:pointer;font-family:var(--font-b);font-weight:500;transition:all .2s}
.btn-a:hover{background:rgba(139,92,246,.2)}
.inp{background:var(--glass);border:1px solid var(--border);color:var(--text);outline:none;font-family:var(--font-b);font-size:.9rem;transition:all .2s;width:100%}
.inp:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(0,212,170,.12)}
.inp::placeholder{color:var(--text3)}
.card{transition:all .3s cubic-bezier(.16,1,.3,1)}
.card:hover{transform:translateY(-3px);border-color:rgba(0,212,170,.28)!important}
.dz{border:2px dashed var(--border2);transition:all .3s}
.dz.ov{border-color:var(--teal);background:rgba(0,212,170,.05);box-shadow:0 0 0 4px rgba(0,212,170,.08)}
.orb{position:absolute;border-radius:50%;filter:blur(80px);animation:orb 9s ease-in-out infinite;pointer-events:none}
.sh{background:linear-gradient(90deg,var(--glass) 25%,var(--glass2) 50%,var(--glass) 75%);background-size:800px 100%;animation:sh 1.6s infinite}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
select.inp option{background:var(--bg2);color:var(--text)}
input[type=checkbox]{accent-color:var(--teal);width:16px;height:16px;cursor:pointer}
@media(max-width:768px){.hm{display:none!important}.sm{display:flex!important}}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const CHART_DATA = [
  {m:"Jan",spent:12400,saved:2100},{m:"Feb",spent:9800,saved:1800},
  {m:"Mar",spent:14500,saved:3200},{m:"Apr",spent:8900,saved:1400},
  {m:"May",spent:21000,saved:4600},{m:"Jun",spent:16700,saved:2900},
];
const PIE = [
  {n:"Food",v:42,c:"#00d4aa"},{n:"Travel",v:28,c:"#8b5cf6"},
  {n:"Stay",v:18,c:"#f59e0b"},{n:"Other",v:12,c:"#ff4d6d"},
];
const RECENT = [
  {id:1,title:"Dinner at Nobu",total:3420,people:4,date:"2d ago",tag:"Food"},
  {id:2,title:"Goa Weekend Trip",total:24800,people:6,date:"1w ago",tag:"Travel"},
  {id:3,title:"Office Lunch",total:870,people:3,date:"2w ago",tag:"Food"},
  {id:4,title:"Hotel Split",total:9600,people:4,date:"3w ago",tag:"Stay"},
];

// ─── Utils ────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).substr(2,9);
const BILL_HISTORY_KEY = "splitai:bills";

function calcSplits(participants, items, payerId) {
  const owed = {};
  participants.forEach(p => { owed[p.id] = 0; });
  items.forEach(item => {
    const n = item.splitAmong.length;
    if (!n) return;
    const share = parseFloat(item.price) / n;
    item.splitAmong.forEach(pid => { owed[pid] = (owed[pid]||0) + share; });
  });
  const total = Object.values(owed).reduce((a,b)=>a+b,0);
  const transactions = participants
    .filter(p => p.id !== payerId && (owed[p.id]||0) > 0.01)
    .map(p => ({
      from: p.name,
      to: participants.find(x=>x.id===payerId)?.name || "Payer",
      amount: +(owed[p.id]||0).toFixed(2)
    }));
  return { owed, total, transactions };
}

const money = (amount) => Number(amount || 0).toLocaleString("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const monthLabel = (date) => date.toLocaleString("en-US", { month: "short" });

function readSavedBills() {
  try {
    const saved = JSON.parse(localStorage.getItem(BILL_HISTORY_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function formatRelativeDate(value) {
  const date = value ? new Date(value) : new Date();
  const diff = Date.now() - date.getTime();
  const days = Math.max(0, Math.floor(diff / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function categoryForBill(bill) {
  const text = `${bill.title || ""} ${(bill.items || []).map((item) => item.name).join(" ")}`.toLowerCase();
  if (/hotel|room|stay|airbnb|resort|hostel/.test(text)) return "Stay";
  if (/petrol|fuel|uber|ola|taxi|flight|train|bus|toll|parking|trip|travel/.test(text)) return "Travel";
  if (/pizza|burger|biryani|rice|cafe|coffee|tea|lunch|dinner|food|restaurant|meal|coke|fries/.test(text)) return "Food";
  return "Other";
}

function summarizeBills(bills) {
  return bills
    .map((bill) => {
      const split = calcSplits(bill.participants || [], bill.items || [], bill.payerId);
      const payerShare = split.owed?.[bill.payerId] || 0;
      return {
        ...bill,
        split,
        category: categoryForBill(bill),
        saved: Math.max(0, split.total - payerShare),
      };
    })
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

function buildDashboard(bills) {
  const summaries = summarizeBills(bills);
  const currency = summaries[0]?.currency || "₹";
  const totalSpent = summaries.reduce((sum, bill) => sum + bill.split.total, 0);
  const savedTotal = summaries.reduce((sum, bill) => sum + bill.saved, 0);
  const friendCount = new Set(summaries.flatMap((bill) => (bill.participants || []).map((p) => p.name))).size;
  const pending = summaries.filter((bill) => bill.split.transactions.length > 0).length;

  const now = new Date();
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { m: monthLabel(date), year: date.getFullYear(), month: date.getMonth(), spent: 0, saved: 0 };
  });

  summaries.forEach((bill) => {
    const date = new Date(bill.updatedAt || bill.createdAt || Date.now());
    const bucket = chartData.find((entry) => entry.year === date.getFullYear() && entry.month === date.getMonth());
    if (bucket) {
      bucket.spent += bill.split.total;
      bucket.saved += bill.saved;
    }
  });

  const categoryColors = {
    Food: "#00d4aa",
    Travel: "#8b5cf6",
    Stay: "#f59e0b",
    Other: "#ff4d6d",
  };
  const categoryTotals = { Food: 0, Travel: 0, Stay: 0, Other: 0 };
  summaries.forEach((bill) => {
    categoryTotals[bill.category] += bill.split.total;
  });
  const categoryGrandTotal = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  const pie = Object.entries(categoryTotals).map(([name, value]) => ({
    n: name,
    v: categoryGrandTotal ? Math.round((value / categoryGrandTotal) * 100) : 0,
    c: categoryColors[name],
  }));

  return {
    summaries,
    currency,
    chartData,
    pie,
    stats: [
      { label: "Total Spent", value: `${currency}${money(totalSpent)}`, sub: `${summaries.length} saved bill${summaries.length === 1 ? "" : "s"}`, icon: <TrendingUp size={18}/>, c: "var(--teal)" },
      { label: "Active Bills", value: String(pending), sub: `${pending} pending settlement`, icon: <ReceiptText size={18}/>, c: "var(--purple)" },
      { label: "Saved in Splits", value: `${currency}${money(savedTotal)}`, sub: "vs paying alone", icon: <Wallet size={18}/>, c: "var(--amber)" },
      { label: "Friends Split With", value: String(friendCount), sub: "across all bills", icon: <Users size={18}/>, c: "#3b82f6" },
    ],
    recent: summaries.slice(0, 5).map((bill) => ({
      id: bill.id,
      title: bill.title || "Untitled Bill",
      total: bill.split.total,
      people: (bill.participants || []).length,
      date: formatRelativeDate(bill.updatedAt || bill.createdAt),
      tag: bill.category,
      currency: bill.currency || currency,
    })),
  };
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function ToastBar({ toasts, removeToast }) {
  return (
    <div style={{position:"fixed",top:80,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:10}}>
      {toasts.map(t => (
        <div key={t.id} className="glass2" style={{
          animation:"ti .38s cubic-bezier(.16,1,.3,1) both",
          borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,
          minWidth:260,maxWidth:360,
          borderLeft:`3px solid ${t.type==="success"?"var(--teal)":t.type==="error"?"var(--danger)":"var(--amber)"}`,
        }}>
          {t.type==="success"?<CheckCircle size={16} color="var(--teal)"/>
           :t.type==="error"?<AlertCircle size={16} color="var(--danger)"/>
           :<AlertCircle size={16} color="var(--amber)"/>}
          <span style={{fontSize:"0.875rem",flex:1,color:"var(--text)"}}>{t.message}</span>
          <button onClick={()=>removeToast(t.id)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text2)",display:"flex"}}>
            <X size={14}/>
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type="success") => {
    const id = uid();
    setToasts(p=>[...p,{id,message,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3600);
  },[]);
  const remove = useCallback((id)=>setToasts(p=>p.filter(t=>t.id!==id)),[]);
  return { toasts, add, remove };
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, navigate, isDark, setIsDark }) {
  const [scroll, setScroll] = useState(false);
  const [mOpen, setMOpen] = useState(false);
  useEffect(()=>{
    const h=()=>setScroll(window.scrollY>20);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);
  const links = [
    {id:"home",icon:<Home size={15}/>,label:"Home"},
    {id:"addBill",icon:<Plus size={15}/>,label:"New Split"},
    {id:"upload",icon:<Upload size={15}/>,label:"Scan Bill"},
    {id:"dashboard",icon:<BarChart2 size={15}/>,label:"Dashboard"},
  ];
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:1000,
      padding:"0 24px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",
      background:scroll?"var(--bg2)":"transparent",
      borderBottom:scroll?"1px solid var(--border)":"none",
      backdropFilter:scroll?"blur(24px)":"none",
      transition:"all .3s",
    }}>
      <button onClick={()=>navigate("home")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,var(--teal),#0891b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <ReceiptText size={16} color="#fff"/>
        </div>
        <span style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.05rem",color:"var(--text)"}}>SplitAI</span>
      </button>
      <div className="hm" style={{display:"flex",gap:4,background:"var(--glass)",backdropFilter:"blur(20px)",border:"1px solid var(--border)",borderRadius:50,padding:"4px 6px"}}>
        {links.map(l=>(
          <button key={l.id} onClick={()=>navigate(l.id)} style={{
            display:"flex",alignItems:"center",gap:6,padding:"6px 14px",
            borderRadius:50,border:"none",cursor:"pointer",fontSize:"0.83rem",fontWeight:500,
            background:page===l.id?"var(--glass2)":"transparent",
            color:page===l.id?"var(--text)":"var(--text2)",
            transition:"all .2s",
          }}>
            {l.icon}{l.label}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={()=>setIsDark(!isDark)} className="btn-g" style={{padding:"8px",borderRadius:10,display:"flex"}}>
          {isDark?<Sun size={16}/>:<Moon size={16}/>}
        </button>
        <button onClick={()=>navigate("addBill")} className="btn-p hm" style={{padding:"8px 18px",borderRadius:10,fontSize:"0.85rem"}}>
          + New Split
        </button>
        <button onClick={()=>setMOpen(!mOpen)} className="btn-g sm" style={{display:"none",padding:8,borderRadius:10}}>
          <ReceiptText size={16}/>
        </button>
      </div>
      {mOpen && (
        <div className="glass2" style={{position:"absolute",top:68,left:16,right:16,borderRadius:16,padding:12,display:"flex",flexDirection:"column",gap:4}}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>{navigate(l.id);setMOpen(false);}} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,
              border:"none",cursor:"pointer",fontSize:"0.9rem",textAlign:"left",
              background:page===l.id?"var(--glass2)":"transparent",
              color:page===l.id?"var(--text)":"var(--text2)",transition:"all .2s",
            }}>
              {l.icon}{l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const features = [
    {icon:<Brain size={22} color="var(--teal)"/>,title:"AI-Powered OCR",desc:"Snap a photo of any receipt and our AI instantly extracts every item, tax, and total with 98%+ accuracy.",color:"rgba(0,212,170,.1)",border:"rgba(0,212,170,.2)"},
    {icon:<Zap size={22} color="var(--purple)"/>,title:"Smart Splitting",desc:"Split by item, percentage, shares, or custom amounts. Handle complex multi-payer scenarios effortlessly.",color:"rgba(139,92,246,.1)",border:"rgba(139,92,246,.2)"},
    {icon:<Shield size={22} color="var(--amber)"/>,title:"Instant Settle-Up",desc:"Minimize transactions with our debt-simplification algorithm. Fewer payments, zero confusion.",color:"rgba(245,158,11,.1)",border:"rgba(245,158,11,.2)"},
  ];
  const stats = [
    {n:"₹2.4Cr+",l:"Split monthly"},{n:"98.4%",l:"OCR accuracy"},{n:"4.9★",l:"User rating"},{n:"0 fees",l:"Always free"},
  ];
  return (
    <div style={{minHeight:"100vh",overflowX:"hidden"}}>
      {/* Hero */}
      <div style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
        <div className="orb" style={{width:500,height:500,background:"var(--teal)",opacity:.08,top:"-10%",right:"-5%"}}/>
        <div className="orb" style={{width:400,height:400,background:"var(--purple)",opacity:.1,bottom:"5%",left:"-5%",animationDelay:"3s"}}/>
        <div className="orb" style={{width:300,height:300,background:"var(--amber)",opacity:.07,top:"30%",right:"20%",animationDelay:"6s"}}/>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"120px 24px 80px",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <div className="au glass" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 14px",borderRadius:50,marginBottom:24,fontSize:"0.8rem",color:"var(--teal)"}}>
              <Sparkles size={12}/> AI-Powered Splits
            </div>
            <h1 className="au d1" style={{fontFamily:"var(--font-d)",fontSize:"clamp(2.6rem,5vw,3.8rem)",fontWeight:800,lineHeight:1.08,marginBottom:20}}>
              Split Bills<br/><span className="gt">Smarter</span> with AI
            </h1>
            <p className="au d2" style={{color:"var(--text2)",fontSize:"1.1rem",maxWidth:440,marginBottom:36,lineHeight:1.7}}>
              Scan any receipt, let AI extract every item, split instantly among friends — no more mental math, no more awkward conversations.
            </p>
            <div className="au d3" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button onClick={()=>navigate("addBill")} className="btn-p" style={{padding:"14px 28px",borderRadius:14,fontSize:"1rem",display:"flex",alignItems:"center",gap:8}}>
                Start Splitting <ArrowRight size={18}/>
              </button>
              <button onClick={()=>navigate("upload")} className="btn-g" style={{padding:"14px 28px",borderRadius:14,fontSize:"1rem",display:"flex",alignItems:"center",gap:8}}>
                <ScanLine size={18}/> Scan Receipt
              </button>
            </div>
            <div className="au d4" style={{display:"flex",gap:28,marginTop:40,flexWrap:"wrap"}}>
              {stats.map(s=>(
                <div key={s.l}>
                  <div style={{fontFamily:"var(--font-d)",fontSize:"1.4rem",fontWeight:700,color:"var(--text)"}}>{s.n}</div>
                  <div style={{fontSize:"0.8rem",color:"var(--text2)"}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Floating preview card */}
          <div className="hm" style={{display:"flex",justifyContent:"center"}}>
            <div className="af" style={{position:"relative",width:"100%",maxWidth:360}}>
              <div className="glass2" style={{borderRadius:24,padding:24,border:"1px solid var(--border2)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div>
                    <div style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.1rem"}}>Goa Trip 🏖️</div>
                    <div style={{color:"var(--text2)",fontSize:"0.8rem"}}>6 people · ₹24,800 total</div>
                  </div>
                  <div style={{background:"rgba(0,212,170,.12)",color:"var(--teal)",borderRadius:8,padding:"4px 10px",fontSize:"0.75rem",fontWeight:600}}>Settled</div>
                </div>
                {[
                  {name:"Aditya",amount:4133,paid:true,avatar:"A"},
                  {name:"Priya",amount:3890,paid:true,avatar:"P"},
                  {name:"Rohan",amount:4500,paid:false,avatar:"R"},
                  {name:"Zara",amount:3200,paid:true,avatar:"Z"},
                ].map((p,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{width:34,height:34,borderRadius:10,background:`hsl(${i*60+180},60%,30%)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:"0.85rem",color:"#fff"}}>
                      {p.avatar}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"0.875rem",fontWeight:500}}>{p.name}</div>
                      <div style={{fontSize:"0.78rem",color:"var(--text2)"}}>owes ₹{p.amount.toLocaleString()}</div>
                    </div>
                    <div style={{color:p.paid?"var(--teal)":"var(--amber)",fontSize:"0.8rem",display:"flex",alignItems:"center",gap:4}}>
                      {p.paid?<CheckCircle size={14}/>:<Clock size={14}/>}
                      {p.paid?"Paid":"Pending"}
                    </div>
                  </div>
                ))}
                <div style={{marginTop:16,background:"linear-gradient(135deg,var(--teal),#0891b2)",borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:"#fff",fontWeight:600,fontSize:"0.9rem"}}>Your share</span>
                  <span style={{color:"#fff",fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.1rem"}}>₹4,133</span>
                </div>
              </div>
              {/* Floating badges */}
              <div className="glass" style={{position:"absolute",top:-16,right:-16,borderRadius:12,padding:"8px 14px",display:"flex",alignItems:"center",gap:6,fontSize:"0.8rem",color:"var(--teal)"}}>
                <Brain size={14}/> AI Scanned
              </div>
              <div className="glass" style={{position:"absolute",bottom:-16,left:-16,borderRadius:12,padding:"8px 14px",display:"flex",alignItems:"center",gap:6,fontSize:"0.8rem",color:"var(--purple)"}}>
                <Zap size={14}/> 3 transactions saved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"80px 24px"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <h2 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"clamp(1.8rem,4vw,2.6rem)",marginBottom:12}}>
            Everything you need to split<br/><span className="gt">without the headache</span>
          </h2>
          <p style={{color:"var(--text2)",fontSize:"1rem",maxWidth:500,margin:"0 auto"}}>Built for groups big and small — whether it's a quick lunch or a 2-week vacation.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
          {features.map((f,i)=>(
            <div key={i} className={`au glass card d${i+1}`} style={{borderRadius:20,padding:28,border:`1px solid ${f.border}`,background:f.color}}>
              <div style={{width:48,height:48,borderRadius:14,background:"var(--glass2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
                {f.icon}
              </div>
              <h3 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.1rem",marginBottom:10}}>{f.title}</h3>
              <p style={{color:"var(--text2)",fontSize:"0.9rem",lineHeight:1.7}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div style={{maxWidth:1100,margin:"0 auto 100px",padding:"0 24px"}}>
        <div className="au" style={{background:"linear-gradient(135deg,rgba(0,212,170,.1),rgba(139,92,246,.1))",border:"1px solid rgba(0,212,170,.2)",borderRadius:24,padding:"48px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:24}}>
          <div>
            <h3 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.8rem",marginBottom:8}}>Ready to split smarter?</h3>
            <p style={{color:"var(--text2)"}}>No account needed. Start splitting in seconds.</p>
          </div>
          <button onClick={()=>navigate("addBill")} className="btn-p" style={{padding:"14px 32px",borderRadius:14,fontSize:"1rem",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>
            Try it free <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Bill Page ─────────────────────────────────────────────────────────────
function AddBillPage({ navigate, setBillData, addToast, draftBill, setDraftBill, saveBill }) {
  const [billId] = useState(() => draftBill?.id || uid());
  const [createdAt] = useState(() => draftBill?.createdAt || new Date().toISOString());
  const [title, setTitle] = useState(() => draftBill?.title || "");
  const [currency, setCurrency] = useState(() => draftBill?.currency || "₹");
  const [pName, setPName] = useState("");
  const [participants, setParticipants] = useState(() => draftBill?.participants || []);
  const [items, setItems] = useState(() => draftBill?.items?.length ? draftBill.items : [{id:uid(),name:"",price:"",splitAmong:[]}]);
  const [payerId, setPayerId] = useState(() => draftBill?.payerId || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (draftBill?.currency) setCurrency(draftBill.currency);
    if (draftBill) setDraftBill(null);
  }, []);

  const addParticipant = () => {
    const n = pName.trim();
    if (!n) return;
    if (participants.find(p=>p.name.toLowerCase()===n.toLowerCase())) {
      addToast("Participant already exists","error"); return;
    }
    const newP = {id:uid(),name:n};
    setParticipants(prev=>[...prev,newP]);
    if (!payerId) setPayerId(newP.id);
    setItems(prev=>prev.map(it=>({...it,splitAmong:[...it.splitAmong,newP.id]})));
    setPName("");
  };

  const removeParticipant = (id) => {
    setParticipants(prev=>prev.filter(p=>p.id!==id));
    setItems(prev=>prev.map(it=>({...it,splitAmong:it.splitAmong.filter(x=>x!==id)})));
    if (payerId===id) setPayerId(participants.find(p=>p.id!==id)?.id||"");
  };

  const addItem = () => setItems(prev=>[...prev,{id:uid(),name:"",price:"",splitAmong:participants.map(p=>p.id)}]);
  const removeItem = (id) => setItems(prev=>prev.filter(it=>it.id!==id));
  const updateItem = (id,field,val) => setItems(prev=>prev.map(it=>it.id===id?{...it,[field]:val}:it));
  const toggleSplit = (itemId, pId) => {
    setItems(prev=>prev.map(it=>{
      if (it.id!==itemId) return it;
      const has = it.splitAmong.includes(pId);
      return {...it,splitAmong:has?it.splitAmong.filter(x=>x!==pId):[...it.splitAmong,pId]};
    }));
  };

  const validate = () => {
    const e={};
    if (!title.trim()) e.title="Bill title is required";
    if (participants.length < 2) e.participants="Add at least 2 people";
    if (!payerId) e.payer="Select who paid";
    const bad = items.some(it=>!it.name.trim()||!it.price||isNaN(parseFloat(it.price))||parseFloat(it.price)<=0);
    if (bad) e.items="All items need a name and valid price";
    const noSplit = items.some(it=>it.splitAmong.length===0);
    if (noSplit) e.items="Each item must be split among at least one person";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleSubmit = () => {
    if (!validate()) { addToast("Please fix the errors","error"); return; }
    const finalBill = {
      id: billId,
      title,
      currency,
      participants,
      items,
      payerId,
      createdAt,
      updatedAt: new Date().toISOString(),
    };
    setBillData(finalBill);
    saveBill(finalBill);
    navigate("results");
  };

  const total = items.reduce((s,it)=>s+(parseFloat(it.price)||0),0);

  return (
    <div style={{minHeight:"100vh",padding:"100px 24px 60px",maxWidth:780,margin:"0 auto"}}>
      <button onClick={()=>navigate("home")} className="btn-g au" style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,marginBottom:24,fontSize:"0.85rem"}}>
        <ArrowLeft size={14}/> Back
      </button>
      <div className="au d1">
        <h1 style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"2rem",marginBottom:6}}>New Bill Split</h1>
        <p style={{color:"var(--text2)",marginBottom:32}}>Add participants and items, then calculate the split.</p>
      </div>

      {/* Bill Details */}
      <div className="au d2 glass" style={{borderRadius:20,padding:24,marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"end"}}>
          <div>
            <label style={{fontSize:"0.8rem",color:"var(--text2)",fontWeight:500,display:"block",marginBottom:6}}>Bill Title</label>
            <input className="inp" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Dinner at Smoke House" style={{padding:"10px 14px",borderRadius:10,fontSize:"0.95rem"}}/>
            {errors.title && <p style={{color:"var(--danger)",fontSize:"0.78rem",marginTop:4}}>{errors.title}</p>}
          </div>
          <div>
            <label style={{fontSize:"0.8rem",color:"var(--text2)",fontWeight:500,display:"block",marginBottom:6}}>Currency</label>
            <select className="inp" value={currency} onChange={e=>setCurrency(e.target.value)} style={{padding:"10px 14px",borderRadius:10,width:"auto",minWidth:80}}>
              {["₹","$","€","£","¥"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="au d2 glass" style={{borderRadius:20,padding:24,marginBottom:20}}>
        <h3 style={{fontFamily:"var(--font-d)",fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
          <Users size={18} color="var(--teal)"/> Participants
          {errors.participants && <span style={{color:"var(--danger)",fontSize:"0.78rem",fontWeight:400,marginLeft:8}}>{errors.participants}</span>}
        </h3>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <input className="inp" value={pName} onChange={e=>setPName(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addParticipant()}
            placeholder="Name (press Enter)" style={{padding:"10px 14px",borderRadius:10}}/>
          <button onClick={addParticipant} className="btn-p" style={{padding:"10px 18px",borderRadius:10,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
            <UserPlus size={16}/> Add
          </button>
        </div>
        {participants.length > 0 && (
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {participants.map(p=>(
              <div key={p.id} className="glass2" style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:50,fontSize:"0.85rem"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,var(--teal),var(--purple))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,color:"#fff"}}>
                  {p.name[0].toUpperCase()}
                </div>
                {p.name}
                {payerId===p.id && <span style={{fontSize:"0.7rem",color:"var(--teal)",background:"rgba(0,212,170,.12)",padding:"1px 6px",borderRadius:50}}>payer</span>}
                <button onClick={()=>removeParticipant(p.id)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",display:"flex",marginLeft:2}}>
                  <X size={12}/>
                </button>
              </div>
            ))}
          </div>
        )}
        {participants.length > 1 && (
          <div style={{marginTop:16}}>
            <label style={{fontSize:"0.8rem",color:"var(--text2)",fontWeight:500,display:"block",marginBottom:6}}>Who paid the bill?</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {participants.map(p=>(
                <button key={p.id} onClick={()=>setPayerId(p.id)} style={{
                  padding:"6px 14px",borderRadius:50,border:"1px solid",fontSize:"0.82rem",cursor:"pointer",fontFamily:"var(--font-b)",
                  borderColor:payerId===p.id?"var(--teal)":"var(--border)",
                  background:payerId===p.id?"rgba(0,212,170,.12)":"var(--glass)",
                  color:payerId===p.id?"var(--teal)":"var(--text2)",transition:"all .2s",
                }}>
                  {p.name}
                </button>
              ))}
            </div>
            {errors.payer && <p style={{color:"var(--danger)",fontSize:"0.78rem",marginTop:4}}>{errors.payer}</p>}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="au d3 glass" style={{borderRadius:20,padding:24,marginBottom:20}}>
        <h3 style={{fontFamily:"var(--font-d)",fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
          <ReceiptText size={18} color="var(--purple)"/> Items
          {errors.items && <span style={{color:"var(--danger)",fontSize:"0.78rem",fontWeight:400,marginLeft:8}}>{errors.items}</span>}
        </h3>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {items.map((item,idx)=>(
            <div key={item.id} className="glass" style={{borderRadius:14,padding:16,border:"1px solid var(--border)"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:10,marginBottom:participants.length?12:0}}>
                <input className="inp" value={item.name} onChange={e=>updateItem(item.id,"name",e.target.value)}
                  placeholder={`Item ${idx+1} (e.g. Biryani)`} style={{padding:"9px 12px",borderRadius:9}}/>
                <div style={{display:"flex",alignItems:"center",gap:0}}>
                  <span style={{fontSize:"0.9rem",color:"var(--text2)",padding:"0 8px"}}>{currency}</span>
                  <input className="inp" type="number" value={item.price} onChange={e=>updateItem(item.id,"price",e.target.value)}
                    placeholder="0.00" style={{padding:"9px 12px",borderRadius:9,width:100,textAlign:"right"}}/>
                </div>
                <button onClick={()=>removeItem(item.id)} className="btn-d" style={{padding:"9px",borderRadius:9,display:"flex"}}>
                  <Trash2 size={15}/>
                </button>
              </div>
              {participants.length > 0 && (
                <div>
                  <div style={{fontSize:"0.75rem",color:"var(--text2)",marginBottom:8}}>Split among:</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {participants.map(p=>(
                      <label key={p.id} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:"0.82rem",
                        background:item.splitAmong.includes(p.id)?"rgba(0,212,170,.08)":"var(--glass)",
                        border:`1px solid ${item.splitAmong.includes(p.id)?"rgba(0,212,170,.25)":"var(--border)"}`,
                        borderRadius:8,padding:"4px 10px",transition:"all .2s",color:item.splitAmong.includes(p.id)?"var(--text)":"var(--text2)"}}>
                        <input type="checkbox" checked={item.splitAmong.includes(p.id)} onChange={()=>toggleSplit(item.id,p.id)} style={{marginRight:2}}/>
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={addItem} className="btn-a" style={{marginTop:14,padding:"9px 18px",borderRadius:10,display:"flex",alignItems:"center",gap:6,fontSize:"0.85rem"}}>
          <Plus size={15}/> Add Item
        </button>
      </div>

      {/* Summary + Submit */}
      <div className="au d4 glass" style={{borderRadius:20,padding:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div>
          <div style={{color:"var(--text2)",fontSize:"0.85rem"}}>Total Amount</div>
          <div style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"1.8rem",color:"var(--teal)"}}>
            {currency}{total.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
          </div>
          <div style={{color:"var(--text2)",fontSize:"0.8rem"}}>{items.length} item{items.length!==1?"s":""} · {participants.length} people</div>
        </div>
        <button onClick={handleSubmit} className="btn-p" style={{padding:"14px 28px",borderRadius:14,fontSize:"1rem",display:"flex",alignItems:"center",gap:8}}>
          Calculate Split <ChevronRight size={18}/>
        </button>
      </div>
    </div>
  );
}

// ─── Results Page ─────────────────────────────────────────────────────────────
function ResultsPage({ billData, navigate, addToast, setDraftBill }) {
  const [visible, setVisible] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setVisible(true),100); return()=>clearTimeout(t); },[]);

  if (!billData) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <ReceiptText size={48} color="var(--text3)"/>
      <p style={{color:"var(--text2)"}}>No bill data found</p>
      <button onClick={()=>navigate("addBill")} className="btn-p" style={{padding:"10px 24px",borderRadius:10}}>Create a Bill</button>
    </div>
  );

  const { title, currency, participants, items, payerId } = billData;
  const { owed, total, transactions } = calcSplits(participants, items, payerId);
  const payer = participants.find(p=>p.id===payerId);
  const colorsMap = ["#00d4aa","#8b5cf6","#f59e0b","#ff4d6d","#3b82f6","#ec4899","#14b8a6","#f97316"];

  return (
    <div style={{minHeight:"100vh",padding:"100px 24px 60px",maxWidth:800,margin:"0 auto"}}>
      <button onClick={()=>{setDraftBill(billData);navigate("addBill");}} className="btn-g au" style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,marginBottom:24,fontSize:"0.85rem"}}>
        <ArrowLeft size={14}/> Edit Bill
      </button>
      <div className="au d1" style={{marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,flexWrap:"wrap"}}>
          <h1 style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"2rem"}}>{title}</h1>
          <div style={{background:"rgba(0,212,170,.12)",color:"var(--teal)",borderRadius:8,padding:"4px 12px",fontSize:"0.78rem",fontWeight:600}}>Calculated</div>
        </div>
        <p style={{color:"var(--text2)"}}>{payer?.name} paid · {participants.length} people · {items.length} items</p>
      </div>

      {/* Total card */}
      <div className="au d2" style={{background:"linear-gradient(135deg,rgba(0,212,170,.12),rgba(139,92,246,.08))",border:"1px solid rgba(0,212,170,.2)",borderRadius:20,padding:24,marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div>
          <div style={{color:"var(--text2)",fontSize:"0.85rem",marginBottom:4}}>Total Bill</div>
          <div style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"2.4rem",color:"var(--teal)"}}>{currency}{total.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>{addToast("Results copied to clipboard","success");}} className="btn-g" style={{padding:"10px 16px",borderRadius:10,display:"flex",alignItems:"center",gap:6,fontSize:"0.85rem"}}>
            <Download size={15}/> Export
          </button>
          <button onClick={()=>{setDraftBill(null);navigate("addBill");}} className="btn-g" style={{padding:"10px 16px",borderRadius:10,display:"flex",alignItems:"center",gap:6,fontSize:"0.85rem"}}>
            <RefreshCw size={15}/> New Bill
          </button>
        </div>
      </div>

      {/* Per person breakdown */}
      <h2 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.2rem",marginBottom:16,color:"var(--text2)",display:"flex",alignItems:"center",gap:8}}>
        <Users size={18}/> Per Person Breakdown
      </h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:28}}>
        {participants.map((p,i)=>{
          const amount = owed[p.id]||0;
          const isP = p.id===payerId;
          const pct = total>0?(amount/total*100):0;
          return (
            <div key={p.id} className={`${visible?"sc":""}  glass card`} style={{borderRadius:18,padding:20,border:"1px solid var(--border)",animationDelay:`${i*0.08}s`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:12,background:colorsMap[i%colorsMap.length]+"22",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:colorsMap[i%colorsMap.length],fontFamily:"var(--font-d)",fontSize:"1rem",border:`1px solid ${colorsMap[i%colorsMap.length]}44`}}>
                    {p.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontWeight:600,fontSize:"0.95rem"}}>{p.name}</div>
                    <div style={{fontSize:"0.75rem",color:"var(--text2)"}}>{isP?"Paid the bill":"Owes"}</div>
                  </div>
                </div>
                {isP && <div style={{background:"rgba(0,212,170,.12)",color:"var(--teal)",borderRadius:6,padding:"2px 8px",fontSize:"0.72rem",fontWeight:600}}>Payer</div>}
              </div>
              <div style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"1.5rem",color:isP?"var(--teal)":"var(--text)",marginBottom:10}}>
                {currency}{amount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
              </div>
              <div style={{height:4,background:"var(--glass2)",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${colorsMap[i%colorsMap.length]},${colorsMap[i%colorsMap.length]}88)`,borderRadius:4,transition:"width .8s cubic-bezier(.16,1,.3,1)"}}/>
              </div>
              <div style={{fontSize:"0.75rem",color:"var(--text2)",marginTop:6}}>{pct.toFixed(1)}% of total</div>
            </div>
          );
        })}
      </div>

      {/* Transactions */}
      {transactions.length > 0 && (
        <>
          <h2 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.2rem",marginBottom:16,color:"var(--text2)",display:"flex",alignItems:"center",gap:8}}>
            <Wallet size={18}/> Settlement Transactions
          </h2>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
            {transactions.map((t,i)=>(
              <div key={i} className={`${visible?"au":""}  glass`} style={{borderRadius:16,padding:18,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,animationDelay:`${i*0.1+0.3}s`}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,77,109,.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--danger)",fontWeight:700,fontSize:"0.9rem"}}>
                    {t.from[0]}
                  </div>
                  <div>
                    <div style={{fontWeight:600,fontSize:"0.9rem"}}>{t.from}</div>
                    <div style={{fontSize:"0.78rem",color:"var(--text2)"}}>pays</div>
                  </div>
                  <ArrowRight size={16} color="var(--text3)"/>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:10,background:"rgba(0,212,170,.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--teal)",fontWeight:700,fontSize:"0.9rem"}}>
                      {t.to[0]}
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:"0.9rem"}}>{t.to}</div>
                      <div style={{fontSize:"0.78rem",color:"var(--text2)"}}>receives</div>
                    </div>
                  </div>
                </div>
                <div style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"1.4rem",color:"var(--teal)"}}>
                  {currency}{t.amount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="au" style={{textAlign:"center",padding:"20px 0"}}>
        <button onClick={()=>navigate("dashboard")} className="btn-g" style={{padding:"12px 24px",borderRadius:12,display:"inline-flex",alignItems:"center",gap:8}}>
          <BarChart2 size={16}/> View Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── Upload Page ───────────────────────────────────────────────────────────────
function UploadPage({ navigate, addToast, setDraftBill }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [loadMsg, setLoadMsg] = useState("");
  const fileRef = useRef();

  const MSGS = ["Scanning receipt...","Extracting items with AI...","Identifying prices...","Organizing data..."];

  const processFile = (f) => {
    if (!f.type.startsWith("image/")) { addToast("Please upload an image file","error"); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const readFileAsDataUrl = (inputFile) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(inputFile);
  });

  const splitDataUrl = (dataUrl, fallbackType) => {
    const [meta, base64] = dataUrl.split(",");
    return {
      base64,
      mimeType: meta.match(/^data:(.+);base64$/)?.[1] || fallbackType || "image/jpeg"
    };
  };

  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not prepare image for scanning."));
    img.src = src;
  });

  const prepareImageForScan = async (inputFile) => {
    const dataUrl = await readFileAsDataUrl(inputFile);
    try {
      const img = await loadImage(dataUrl);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(width, height));

      if (scale === 1 && inputFile.size < 4 * 1024 * 1024) {
        return splitDataUrl(dataUrl, inputFile.type);
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return splitDataUrl(canvas.toDataURL("image/jpeg", 0.86), "image/jpeg");
    } catch {
      return splitDataUrl(dataUrl, inputFile.type);
    }
  };

  const analyzeWithAI = async () => {
    if (!file) { addToast("Please upload an image first","error"); return; }
    setLoading(true); setResult(null);
    let msgIdx = 0;
    setLoadMsg(MSGS[0]);
    const interval = setInterval(()=>{ msgIdx=(msgIdx+1)%MSGS.length; setLoadMsg(MSGS[msgIdx]); },1800);
    try {
      const { base64, mimeType } = await prepareImageForScan(file);
      const resp = await fetch("/api/split-bill",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ imageBase64: base64, mimeType })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error || "Could not parse bill.");
      setResult({
        restaurant:data.restaurant,
        items:data.items || [],
        subtotal:data.subtotal || 0,
        tax:data.tax || 0,
        total:data.total || 0
      });
      addToast("Bill scanned successfully!","success");
    } catch(err) {
      addToast(err.message || "Could not parse bill. Try a clearer image.","error");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const useExtracted = () => {
    if (!result) return;
    setDraftBill({
      id: uid(),
      title: result.restaurant || "Scanned Bill",
      currency:"₹",
      participants: [],
      payerId: "",
      items: result.items.map(it=>({id:uid(),name:it.name,price:String(it.price||0),splitAmong:[]})),
      createdAt: new Date().toISOString(),
      source: "scan",
    });
    addToast("Add friends and choose who shared each item","success");
    navigate("addBill");
  };

  return (
    <div style={{minHeight:"100vh",padding:"100px 24px 60px",maxWidth:760,margin:"0 auto"}}>
      <button onClick={()=>navigate("home")} className="btn-g au" style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,marginBottom:24,fontSize:"0.85rem"}}>
        <ArrowLeft size={14}/> Back
      </button>
      <div className="au d1" style={{marginBottom:32}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(139,92,246,.1)",border:"1px solid rgba(139,92,246,.2)",borderRadius:50,padding:"6px 14px",marginBottom:16,fontSize:"0.8rem",color:"var(--purple)"}}>
          <Brain size={12}/> AI-Powered OCR
        </div>
        <h1 style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"2rem",marginBottom:8}}>Scan Your Bill</h1>
        <p style={{color:"var(--text2)"}}>Upload a photo of any receipt and AI will extract all items automatically.</p>
      </div>

      {/* Drop Zone */}
      <div className="au d2" onDrop={handleDrop} onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
        onClick={()=>!preview&&fileRef.current?.click()}
        style={{borderRadius:24,overflow:"hidden",marginBottom:20,cursor:preview?"default":"pointer"}}>
        <div className={`dz ${dragOver?"ov":""}`} style={{borderRadius:24,minHeight:240,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
          {preview ? (
            <div style={{width:"100%",position:"relative"}}>
              <img src={preview} alt="Bill preview" style={{width:"100%",maxHeight:400,objectFit:"contain",borderRadius:22}}/>
              <div style={{position:"absolute",top:12,right:12,display:"flex",gap:8}}>
                <button onClick={e=>{e.stopPropagation();setPreview(null);setFile(null);setResult(null);}} className="btn-d" style={{padding:"6px 12px",borderRadius:8,fontSize:"0.8rem",display:"flex",alignItems:"center",gap:4}}>
                  <X size={12}/> Remove
                </button>
                <button onClick={e=>{e.stopPropagation();fileRef.current?.click();}} className="btn-g" style={{padding:"6px 12px",borderRadius:8,fontSize:"0.8rem",display:"flex",alignItems:"center",gap:4}}>
                  <RefreshCw size={12}/> Change
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{width:72,height:72,borderRadius:20,background:"rgba(139,92,246,.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16,border:"1px solid rgba(139,92,246,.2)"}}>
                <FileImage size={32} color="var(--purple)"/>
              </div>
              <div style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.1rem",marginBottom:6}}>Drop your receipt here</div>
              <div style={{color:"var(--text2)",fontSize:"0.875rem"}}>or click to browse · JPG, PNG, HEIC</div>
            </>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&processFile(e.target.files[0])}/>

      {/* Analyze button */}
      {preview && !result && (
        <div className="au" style={{marginBottom:20}}>
          <button onClick={analyzeWithAI} disabled={loading} className="btn-p" style={{width:"100%",padding:"14px",borderRadius:14,fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:10,opacity:loading?0.8:1}}>
            {loading ? (
              <><Loader2 size={18} className="spin"/> {loadMsg}</>
            ) : (
              <><Brain size={18}/> Analyze with AI</>
            )}
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="au glass" style={{borderRadius:20,padding:24}}>
          {[1,2,3,4].map(i=>(
            <div key={i} className="sh" style={{height:36,borderRadius:8,marginBottom:12}}/>
          ))}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="au glass" style={{borderRadius:20,padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <h3 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.1rem"}}>{result.restaurant||"Receipt"}</h3>
              <p style={{color:"var(--text2)",fontSize:"0.85rem"}}>{result.items?.length||0} items extracted</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,color:"var(--teal)",fontSize:"0.82rem",background:"rgba(0,212,170,.1)",padding:"5px 12px",borderRadius:8}}>
              <CheckCircle size={14}/> Scanned
            </div>
          </div>
          {result.items?.map((it,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)",fontSize:"0.9rem"}}>
              <span>{it.name}</span>
              <span style={{fontWeight:600,color:"var(--teal)"}}>₹{Number(it.price||0).toFixed(2)}</span>
            </div>
          ))}
          {(result.tax||result.subtotal) && (
            <div style={{marginTop:12,padding:"12px 0",borderTop:"1px solid var(--border2)"}}>
              {result.subtotal>0&&<div style={{display:"flex",justifyContent:"space-between",color:"var(--text2)",fontSize:"0.85rem",marginBottom:4}}><span>Subtotal</span><span>₹{result.subtotal}</span></div>}
              {result.tax>0&&<div style={{display:"flex",justifyContent:"space-between",color:"var(--text2)",fontSize:"0.85rem",marginBottom:4}}><span>Tax</span><span>₹{result.tax}</span></div>}
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,paddingTop:12,borderTop:"1px solid var(--border2)"}}>
            <span style={{fontFamily:"var(--font-d)",fontWeight:700}}>Total</span>
            <span style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"1.3rem",color:"var(--teal)"}}>₹{result.total||result.items?.reduce((s,i)=>s+(i.price||0),0)||0}</span>
          </div>
          <button onClick={useExtracted} className="btn-p" style={{width:"100%",marginTop:20,padding:"13px",borderRadius:12,fontSize:"0.95rem",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            Use These Items to Split <ArrowRight size={16}/>
          </button>
        </div>
      )}

      {/* Tips */}
      {!preview && (
        <div className="au d3 glass" style={{borderRadius:16,padding:20,marginTop:20}}>
          <h4 style={{fontWeight:600,marginBottom:12,fontSize:"0.9rem",color:"var(--text2)"}}>Tips for best results</h4>
          {["Ensure the receipt is well-lit and fully visible","Lay it flat to avoid distortion","Capture all text including total and tax","JPEG or PNG under 5MB works best"].map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8,fontSize:"0.83rem",color:"var(--text2)"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"rgba(0,212,170,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <CheckCircle size={11} color="var(--teal)"/>
              </div>
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const CustomTooltip = ({active,payload,label,currency="₹"}) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:10,padding:"10px 14px",fontSize:"0.82rem"}}>
      <p style={{color:"var(--text2)",marginBottom:4}}>{label}</p>
      <p style={{color:"var(--teal)",fontWeight:600}}>{currency}{(payload[0]?.value||0).toLocaleString()}</p>
    </div>
  );
};

function DashboardPage({ navigate, bills = [] }) {
  const dashboard = buildDashboard(bills);
  const stats = dashboard.stats;
  const sampleStats = [
    {label:"Total Spent",value:"₹74,360",sub:"+12% vs last month",icon:<TrendingUp size={18}/>,c:"var(--teal)"},
    {label:"Active Bills",value:"3",sub:"2 pending settlement",icon:<ReceiptText size={18}/>,c:"var(--purple)"},
    {label:"Saved in Splits",value:"₹16,000",sub:"vs paying alone",icon:<Wallet size={18}/>,c:"var(--amber)"},
    {label:"Friends Split With",value:"14",sub:"across all bills",icon:<Users size={18}/>,c:"#3b82f6"},
  ];
  const tagColors = {Food:"rgba(0,212,170,.12)",Travel:"rgba(139,92,246,.12)",Stay:"rgba(245,158,11,.12)",Other:"rgba(255,77,109,.12)"};
  const tagText = {Food:"var(--teal)",Travel:"var(--purple)",Stay:"var(--amber)",Other:"var(--danger)"};
  const period = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div style={{minHeight:"100vh",padding:"100px 24px 60px",maxWidth:1100,margin:"0 auto"}}>
      <div className="au d1" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16,marginBottom:32}}>
        <div>
          <h1 style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"2rem",marginBottom:6}}>Dashboard</h1>
          <p style={{color:"var(--text2)"}}>Your expense overview — {period}</p>
        </div>
        <button onClick={()=>navigate("addBill")} className="btn-p" style={{padding:"11px 22px",borderRadius:12,fontSize:"0.9rem",display:"flex",alignItems:"center",gap:8}}>
          <Plus size={16}/> New Split
        </button>
      </div>

      {/* Stats */}
      <div className="au d2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:24}}>
        {stats.map((s,i)=>(
          <div key={i} className="glass card" style={{borderRadius:18,padding:20,border:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${s.c}18`,display:"flex",alignItems:"center",justifyContent:"center",color:s.c}}>{s.icon}</div>
              <ChevronRight size={14} color="var(--text3)"/>
            </div>
            <div style={{fontFamily:"var(--font-d)",fontWeight:800,fontSize:"1.5rem",marginBottom:4}}>{s.value}</div>
            <div style={{color:"var(--text2)",fontSize:"0.8rem"}}>{s.label}</div>
            <div style={{color:"var(--teal)",fontSize:"0.75rem",marginTop:4}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:24}}>
        <div className="au d3 glass" style={{borderRadius:20,padding:24,border:"1px solid var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <h3 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1rem"}}>Monthly Spending</h3>
              <p style={{color:"var(--text2)",fontSize:"0.8rem"}}>{dashboard.chartData[0]?.m} – {dashboard.chartData[dashboard.chartData.length-1]?.m} {new Date().getFullYear()}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dashboard.chartData} margin={{top:0,right:0,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{fill:"var(--text2)",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"var(--text2)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${dashboard.currency}${v/1000}k`}/>
              <Tooltip content={<CustomTooltip currency={dashboard.currency}/>}/>
              <Area type="monotone" dataKey="spent" stroke="#00d4aa" strokeWidth={2} fill="url(#tg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="au d3 glass" style={{borderRadius:20,padding:24,border:"1px solid var(--border)"}}>
          <h3 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1rem",marginBottom:4}}>Category Split</h3>
          <p style={{color:"var(--text2)",fontSize:"0.8rem",marginBottom:16}}>All time</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={dashboard.pie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="v" paddingAngle={3}>
                {dashboard.pie.map((entry,i)=><Cell key={i} fill={entry.c} strokeWidth={0}/>)}
              </Pie>
              <Tooltip formatter={(v)=>`${v}%`} contentStyle={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:8,fontSize:"0.8rem"}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
            {dashboard.pie.map((p,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.8rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:p.c}}/>
                  <span style={{color:"var(--text2)"}}>{p.n}</span>
                </div>
                <span style={{fontWeight:600}}>{p.v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bills */}
      <div className="au d4 glass" style={{borderRadius:20,padding:24,border:"1px solid var(--border)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1rem"}}>Recent Bills</h3>
          <button className="btn-g" style={{padding:"6px 14px",borderRadius:8,fontSize:"0.8rem",display:"flex",alignItems:"center",gap:6}}>
            View all <ChevronRight size={12}/>
          </button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:1}}>
          {dashboard.recent.length === 0 && (
            <div style={{padding:"18px 0",color:"var(--text2)",fontSize:"0.9rem"}}>No bills calculated yet</div>
          )}
          {dashboard.recent.map((b,i)=>(
            <div key={b.id} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:i<dashboard.recent.length-1?"1px solid var(--border)":"none"}}>
              <div style={{width:44,height:44,borderRadius:12,background:"var(--glass2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text2)"}}>
                <ReceiptText size={18}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:"0.9rem",marginBottom:2}}>{b.title}</div>
                <div style={{color:"var(--text2)",fontSize:"0.78rem",display:"flex",alignItems:"center",gap:8}}>
                  <Users size={11}/>{b.people} people · {b.date}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1rem"}}>{b.currency}{b.total.toLocaleString()}</div>
                <div style={{fontSize:"0.72rem",background:tagColors[b.tag],color:tagText[b.tag],padding:"2px 8px",borderRadius:6,marginTop:3,display:"inline-block"}}>{b.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ navigate }) {
  return (
    <footer style={{borderTop:"1px solid var(--border)",padding:"40px 24px",marginTop:40}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,var(--teal),#0891b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <ReceiptText size={14} color="#fff"/>
          </div>
          <span style={{fontFamily:"var(--font-d)",fontWeight:700,color:"var(--text)"}}>SplitAI</span>
          <span style={{color:"var(--text3)",fontSize:"0.8rem",marginLeft:8}}>© 2025</span>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          {[["home","Home"],["addBill","Split"],["upload","Scan"],["dashboard","Dashboard"]].map(([id,l])=>(
            <button key={id} onClick={()=>navigate(id)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text2)",fontSize:"0.85rem",fontFamily:"var(--font-b)",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color="var(--text)"} onMouseLeave={e=>e.target.style.color="var(--text2)"}>
              {l}
            </button>
          ))}
        </div>
        <div style={{color:"var(--text3)",fontSize:"0.78rem"}}>Smart bill splitting</div>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [billData, setBillData] = useState(null);
  const [draftBill, setDraftBill] = useState(null);
  const [billHistory, setBillHistory] = useState(readSavedBills);
  const { toasts, add: addToast, remove: removeToast } = useToast();

  useEffect(() => {
    localStorage.setItem(BILL_HISTORY_KEY, JSON.stringify(billHistory));
  }, [billHistory]);

  const saveBill = useCallback((bill) => {
    setBillHistory((prev) => {
      const withoutCurrent = prev.filter((existing) => existing.id !== bill.id);
      return [bill, ...withoutCurrent].slice(0, 50);
    });
  }, []);

  const navigate = useCallback((p) => {
    window.scrollTo({top:0,behavior:"smooth"});
    setPage(p);
  }, []);

  useEffect(() => {
    document.documentElement.style.background = isDark ? "#04091a" : "#f0f5ff";
  }, [isDark]);

  return (
    <div className={isDark ? "" : "lm"} style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",transition:"background .3s, color .3s"}}>
      <style>{CSS}</style>
      <ToastBar toasts={toasts} removeToast={removeToast}/>
      <Navbar page={page} navigate={navigate} isDark={isDark} setIsDark={setIsDark}/>
      <main key={page} className="ai">
        {page === "home" && <HomePage navigate={navigate}/>}
        {page === "addBill" && <AddBillPage navigate={navigate} setBillData={setBillData} addToast={addToast} draftBill={draftBill} setDraftBill={setDraftBill} saveBill={saveBill}/>}
        {page === "results" && <ResultsPage billData={billData} navigate={navigate} addToast={addToast} setDraftBill={setDraftBill}/>}
        {page === "upload" && <UploadPage navigate={navigate} addToast={addToast} setDraftBill={setDraftBill}/>}
        {page === "dashboard" && <DashboardPage navigate={navigate} bills={billHistory}/>}
      </main>
      <Footer navigate={navigate}/>
    </div>
  );
}
