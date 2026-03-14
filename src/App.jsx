import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const tokens = {
  sage:    "#7BAE8C",
  sage2:   "#A8C9B0",
  sage3:   "#D4EBD9",
  cream:   "#FDF8F0",
  warm:    "#F5EDD8",
  amber:   "#E8A44A",
  amber2:  "#F2C87E",
  rust:    "#C4673A",
  slate:   "#4A5568",
  slate2:  "#718096",
  slate3:  "#A0AEC0",
  white:   "#FFFFFF",
  shadow:  "rgba(74,85,104,0.12)",
  shadowD: "rgba(74,85,104,0.22)",
  radius:  "16px",
  radiusSm:"10px",
  fontHead:"'Lora', Georgia, serif",
  fontBody:"'DM Sans', 'Helvetica Neue', sans-serif",
};

// ─── SONG DATA ─────────────────────────────────────────────────────────────────
const SONGS = [
  { id:1, title:"You Are My Sunshine",     decade:"1940s", mood:"Cheerful",  bpm:90,  notes:"Simple chorus, easy to hum along" },
  { id:2, title:"What a Wonderful World",  decade:"1960s", mood:"Calm",      bpm:68,  notes:"Gentle and uplifting" },
  { id:3, title:"Moon River",              decade:"1960s", mood:"Calm",      bpm:72,  notes:"Familiar melody, slow pace" },
  { id:4, title:"Que Sera Sera",           decade:"1950s", mood:"Cheerful",  bpm:85,  notes:"Repetitive and singable" },
  { id:5, title:"As Time Goes By",         decade:"1940s", mood:"Nostalgic", bpm:76,  notes:"Strong emotional memory anchor" },
  { id:6, title:"Take Me Home Country Roads", decade:"1970s", mood:"Cheerful", bpm:96, notes:"Familiar to many residents" },
  { id:7, title:"Somewhere Over the Rainbow", decade:"1930s", mood:"Calm",   bpm:62,  notes:"Dreamy, good for wind-down" },
  { id:8, title:"Danny Boy",               decade:"1940s", mood:"Nostalgic", bpm:58,  notes:"Deeply familiar, may prompt memories" },
];

const NUDGE_CARDS = [
  { id:1, emoji:"☀️", title:"Morning Light",      body:"Open the curtains together. Name three things you can see outside.", category:"Sensory" },
  { id:2, emoji:"🌿", title:"Leaf by Leaf",       body:"Hand them a houseplant. Ask: 'What do you think this one needs today?'", category:"Grounding" },
  { id:3, emoji:"📸", title:"Memory Bridge",      body:"Look at one photo together. No pressure to remember — just describe what you see.", category:"Connection" },
  { id:4, emoji:"🎵", title:"Hum Along",          body:"Play a familiar song softly. Sit beside them and let the music do the work.", category:"Music" },
  { id:5, emoji:"🤝", title:"Hand Warmth",        body:"Offer a gentle hand massage with lotion. Ask: 'Does this pressure feel okay?'", category:"Touch" },
  { id:6, emoji:"🍵", title:"Tea Ritual",         body:"Make two cups of tea. Let them hold the warm mug and just be present together.", category:"Routine" },
  { id:7, emoji:"🌬️", title:"Breath Together",   body:"Breathe in for 4, hold for 2, out for 6. Do it visibly — they may follow.", category:"Calm" },
  { id:8, emoji:"📖", title:"Read a Page",        body:"Read one short poem or paragraph aloud. Familiar voices calm the nervous system.", category:"Voice" },
];

const STAGES = [
  { id:"early",  label:"Early Stage",    color: tokens.sage,  desc:"Memory slips, still largely independent" },
  { id:"middle", label:"Middle Stage",   color: tokens.amber, desc:"Needs assistance with daily tasks" },
  { id:"late",   label:"Late Stage",     color: tokens.rust,  desc:"Full-time care, nonverbal communication" },
];

const TRANSITION_ITEMS = [
  { id:1, category:"Medical",   item:"Primary care physician contact",       stage:"early" },
  { id:2, category:"Medical",   item:"Memory specialist / neurologist",      stage:"early" },
  { id:3, category:"Medical",   item:"Medication management plan",           stage:"middle" },
  { id:4, category:"Legal",     item:"Power of Attorney signed",             stage:"early" },
  { id:5, category:"Legal",     item:"Healthcare directive completed",       stage:"early" },
  { id:6, category:"Legal",     item:"Trust or will updated",                stage:"early" },
  { id:7, category:"Financial", item:"Bank access granted to caregiver",     stage:"middle" },
  { id:8, category:"Financial", item:"Bills on auto-pay",                    stage:"middle" },
  { id:9, category:"Home",      item:"Fall hazards removed",                 stage:"middle" },
  { id:10,category:"Home",      item:"Door alarms / wandering alerts",       stage:"middle" },
  { id:11,category:"Home",      item:"Hospital bed / lift equipment",        stage:"late" },
  { id:12,category:"Care",      item:"In-home aide scheduled",               stage:"middle" },
  { id:13,category:"Care",      item:"Memory care facility researched",      stage:"middle" },
  { id:14,category:"Care",      item:"Hospice care discussed",               stage:"late" },
  { id:15,category:"Caregiver", item:"Respite care arranged",                stage:"middle" },
  { id:16,category:"Caregiver", item:"Support group joined",                 stage:"early" },
];

// ─── RESET STEPS ───────────────────────────────────────────────────────────────
const RESET_STEPS = [
  { id:1, duration:60, title:"Breathe",         instruction:"Breathe in 4 counts, hold 2, out 6. Repeat slowly.",      emoji:"🌬️", color:tokens.sage },
  { id:2, duration:60, title:"Notice 5 Things", instruction:"Name 5 things you can see. Just observe, no judgment.",   emoji:"👁️", color:tokens.sage2 },
  { id:3, duration:60, title:"Unclench",        instruction:"Roll your shoulders. Unclench your jaw and hands.",        emoji:"🤲", color:tokens.amber2 },
  { id:4, duration:60, title:"One Kind Thought",instruction:"Think of one moment when you helped. That mattered.",     emoji:"💛", color:tokens.amber },
  { id:5, duration:60, title:"Return",          instruction:"You're still here. That's enough. Take one more breath.", emoji:"🌿", color:tokens.sage },
];

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const css = (obj) => Object.entries(obj).map(([k,v])=>`${k.replace(/([A-Z])/g,m=>"-"+m.toLowerCase())}:${v}`).join(";");

function Card({ children, style={} }) {
  return (
    <div style={{
      background: tokens.white,
      borderRadius: tokens.radius,
      boxShadow: `0 4px 20px ${tokens.shadow}`,
      padding: "24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Badge({ children, color=tokens.sage }) {
  return (
    <span style={{
      display:"inline-block",
      background: color + "30",
      color: color,
      borderRadius: "20px",
      padding: "2px 10px",
      fontSize: "11px",
      fontWeight: 600,
      fontFamily: tokens.fontBody,
      letterSpacing: "0.04em",
    }}>
      {children}
    </span>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: tokens.fontBody,
      fontSize: "14px",
      fontWeight: active ? 700 : 500,
      color: active ? tokens.white : tokens.slate2,
      background: active ? tokens.sage : "transparent",
      border: "none",
      borderRadius: tokens.radiusSm,
      padding: "8px 20px",
      cursor: "pointer",
      transition: "all 0.2s",
    }}>
      {label}
    </button>
  );
}

// ─── DASHBOARD V2 ──────────────────────────────────────────────────────────────
function Dashboard() {
  const [mood, setMood] = useState(null);
  const [careLevel, setCareLevel] = useState("middle");
  const moods = [
    { emoji:"😌", label:"Peaceful" },
    { emoji:"😟", label:"Anxious" },
    { emoji:"😤", label:"Agitated" },
    { emoji:"😴", label:"Tired" },
    { emoji:"😊", label:"Content" },
  ];
  const today = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${tokens.sage} 0%, ${tokens.sage2} 100%)`,
        borderRadius: tokens.radius,
        padding: "28px 32px",
        color: tokens.white,
      }}>
        <div style={{ fontFamily:tokens.fontBody, fontSize:"13px", opacity:0.8, marginBottom:"4px" }}>{today}</div>
        <h1 style={{ fontFamily:tokens.fontHead, fontSize:"28px", margin:0, fontWeight:700 }}>Good day, Caregiver</h1>
        <p style={{ fontFamily:tokens.fontBody, fontSize:"14px", opacity:0.85, margin:"8px 0 0" }}>
          How is your person feeling today?
        </p>
        <div style={{ display:"flex", gap:"10px", marginTop:"16px", flexWrap:"wrap" }}>
          {moods.map(m=>(
            <button key={m.label} onClick={()=>setMood(m.label)} style={{
              display:"flex", alignItems:"center", gap:"6px",
              background: mood===m.label ? tokens.white : "rgba(255,255,255,0.25)",
              color: mood===m.label ? tokens.sage : tokens.white,
              border: "none", borderRadius:"20px",
              padding:"6px 14px", cursor:"pointer",
              fontFamily:tokens.fontBody, fontSize:"13px", fontWeight:600,
              transition:"all 0.2s",
            }}>
              <span>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
        {mood && (
          <div style={{
            marginTop:"14px", background:"rgba(255,255,255,0.2)",
            borderRadius: tokens.radiusSm, padding:"10px 14px",
            fontFamily:tokens.fontBody, fontSize:"13px",
          }}>
            {mood === "Agitated" ? "💡 Try the 5-Minute Reset or a Nudge Card for calm." :
             mood === "Anxious"  ? "💡 Familiar music and gentle touch can help right now." :
             mood === "Tired"    ? "💡 Keep activities minimal today. Rest is valid care." :
             mood === "Peaceful" ? "✅ A good moment — consider a memory bridge activity." :
                                   "✅ Content is wonderful. Keep the environment steady."}
          </div>
        )}
      </div>

      {/* Care Stage */}
      <Card>
        <h3 style={{ fontFamily:tokens.fontHead, margin:"0 0 14px", color:tokens.slate }}>Current Care Stage</h3>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          {STAGES.map(s=>(
            <button key={s.id} onClick={()=>setCareLevel(s.id)} style={{
              flex:1, minWidth:"120px",
              background: careLevel===s.id ? s.color : tokens.warm,
              color: careLevel===s.id ? tokens.white : tokens.slate,
              border: `2px solid ${careLevel===s.id ? s.color : "transparent"}`,
              borderRadius:tokens.radiusSm, padding:"14px 10px",
              cursor:"pointer", textAlign:"left",
              fontFamily:tokens.fontBody, transition:"all 0.2s",
            }}>
              <div style={{ fontWeight:700, fontSize:"14px" }}>{s.label}</div>
              <div style={{ fontSize:"11px", opacity:0.8, marginTop:"4px" }}>{s.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"14px" }}>
        {[
          { label:"Tasks Today",    value:"3 of 5",  emoji:"✅", color:tokens.sage },
          { label:"Nudges Used",    value:"2",        emoji:"💛", color:tokens.amber },
          { label:"Reset Sessions", value:"1",        emoji:"🌬️", color:tokens.sage2 },
          { label:"Care Day",       value:"Day 847",  emoji:"📅", color:tokens.rust },
        ].map(s=>(
          <Card key={s.label} style={{ padding:"18px", textAlign:"center" }}>
            <div style={{ fontSize:"24px" }}>{s.emoji}</div>
            <div style={{ fontFamily:tokens.fontHead, fontSize:"22px", fontWeight:700, color:s.color, margin:"4px 0 2px" }}>{s.value}</div>
            <div style={{ fontFamily:tokens.fontBody, fontSize:"12px", color:tokens.slate3 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Song of the Day */}
      <Card style={{ background:`linear-gradient(135deg,${tokens.warm},${tokens.cream})` }}>
        <h3 style={{ fontFamily:tokens.fontHead, margin:"0 0 6px", color:tokens.slate }}>🎵 Song of the Day</h3>
        {(() => {
          const song = SONGS[new Date().getDate() % SONGS.length];
          return (
            <>
              <div style={{ fontFamily:tokens.fontHead, fontSize:"20px", color:tokens.rust, marginBottom:"6px" }}>{song.title}</div>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"8px" }}>
                <Badge color={tokens.sage}>{song.decade}</Badge>
                <Badge color={tokens.amber}>{song.mood}</Badge>
                <Badge color={tokens.slate2}>{song.bpm} BPM</Badge>
              </div>
              <p style={{ fontFamily:tokens.fontBody, fontSize:"13px", color:tokens.slate2, margin:0 }}>{song.notes}</p>
            </>
          );
        })()}
      </Card>
    </div>
  );
}

// ─── TRANSITION PLANNER ────────────────────────────────────────────────────────
function TransitionPlanner() {
  const [checked, setChecked] = useState({});
  const [filterStage, setFilterStage] = useState("all");

  const toggle = (id) => setChecked(p=>({ ...p, [id]: !p[id] }));
  const filtered = filterStage==="all" ? TRANSITION_ITEMS : TRANSITION_ITEMS.filter(i=>i.stage===filterStage);
  const categories = [...new Set(filtered.map(i=>i.category))];
  const total = TRANSITION_ITEMS.length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done/total)*100);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      <Card style={{ background:`linear-gradient(135deg,${tokens.amber},${tokens.amber2})`, color:tokens.white }}>
        <h2 style={{ fontFamily:tokens.fontHead, margin:"0 0 8px", fontSize:"24px" }}>Transition Planner</h2>
        <p style={{ fontFamily:tokens.fontBody, fontSize:"13px", opacity:0.9, margin:"0 0 16px" }}>
          Track care milestones across every stage of the journey.
        </p>
        <div style={{ background:"rgba(255,255,255,0.3)", borderRadius:"8px", height:"8px", marginBottom:"8px" }}>
          <div style={{ background:tokens.white, width:`${pct}%`, height:"100%", borderRadius:"8px", transition:"width 0.4s" }} />
        </div>
        <div style={{ fontFamily:tokens.fontBody, fontSize:"13px", opacity:0.9 }}>{done} of {total} items completed · {pct}%</div>
      </Card>

      {/* Stage Filter */}
      <Card style={{ padding:"14px 20px" }}>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontFamily:tokens.fontBody, fontSize:"13px", color:tokens.slate2, marginRight:"4px" }}>Show:</span>
          {["all","early","middle","late"].map(s=>(
            <Tab key={s} label={s==="all"?"All Stages":STAGES.find(x=>x.id===s)?.label||s} active={filterStage===s} onClick={()=>setFilterStage(s)} />
          ))}
        </div>
      </Card>

      {categories.map(cat=>(
        <Card key={cat}>
          <h3 style={{ fontFamily:tokens.fontHead, margin:"0 0 14px", color:tokens.slate, fontSize:"18px" }}>
            {cat === "Medical" ? "🏥" : cat === "Legal" ? "⚖️" : cat === "Financial" ? "💰" : cat === "Home" ? "🏠" : cat === "Care" ? "❤️" : "🌿"} {cat}
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {filtered.filter(i=>i.category===cat).map(item=>(
              <label key={item.id} style={{
                display:"flex", alignItems:"center", gap:"12px",
                cursor:"pointer", padding:"10px 12px", borderRadius:tokens.radiusSm,
                background: checked[item.id] ? tokens.sage3 : tokens.cream,
                transition:"background 0.2s",
              }}>
                <input type="checkbox" checked={!!checked[item.id]} onChange={()=>toggle(item.id)}
                  style={{ width:"18px", height:"18px", accentColor:tokens.sage, cursor:"pointer" }} />
                <span style={{
                  fontFamily:tokens.fontBody, fontSize:"14px",
                  color: checked[item.id] ? tokens.slate2 : tokens.slate,
                  textDecoration: checked[item.id] ? "line-through" : "none",
                  flex:1,
                }}>
                  {item.item}
                </span>
                <Badge color={STAGES.find(s=>s.id===item.stage)?.color || tokens.slate2}>
                  {STAGES.find(s=>s.id===item.stage)?.label || item.stage}
                </Badge>
              </label>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── NUDGE CARDS ───────────────────────────────────────────────────────────────
function NudgeCards() {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(NUDGE_CARDS.map(c=>c.category))];
  const visible = filter==="All" ? NUDGE_CARDS : NUDGE_CARDS.filter(c=>c.category===filter);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      <Card style={{ background:`linear-gradient(135deg,${tokens.sage3},${tokens.cream})` }}>
        <h2 style={{ fontFamily:tokens.fontHead, margin:"0 0 6px", fontSize:"24px", color:tokens.slate }}>Nudge Cards</h2>
        <p style={{ fontFamily:tokens.fontBody, fontSize:"13px", color:tokens.slate2, margin:0 }}>
          Small, meaningful moments of connection. Pick one anytime.
        </p>
      </Card>

      <Card style={{ padding:"14px 20px" }}>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {categories.map(c=>(
            <Tab key={c} label={c} active={filter===c} onClick={()=>setFilter(c)} />
          ))}
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px" }}>
        {visible.map(card=>(
          <div key={card.id} onClick={()=>setActive(active===card.id ? null : card.id)}
            style={{
              background: active===card.id
                ? `linear-gradient(135deg,${tokens.sage},${tokens.sage2})`
                : tokens.white,
              borderRadius:tokens.radius,
              boxShadow: active===card.id ? `0 8px 32px ${tokens.shadowD}` : `0 4px 16px ${tokens.shadow}`,
              padding:"22px",
              cursor:"pointer",
              transition:"all 0.25s",
              transform: active===card.id ? "translateY(-4px)" : "none",
            }}>
            <div style={{ fontSize:"32px", marginBottom:"10px" }}>{card.emoji}</div>
            <div style={{
              fontFamily:tokens.fontHead, fontSize:"17px", fontWeight:700,
              color: active===card.id ? tokens.white : tokens.slate,
              marginBottom:"6px",
            }}>
              {card.title}
            </div>
            <Badge color={active===card.id ? tokens.white : tokens.sage}>{card.category}</Badge>
            {active===card.id && (
              <p style={{
                fontFamily:tokens.fontBody, fontSize:"14px",
                color: "rgba(255,255,255,0.92)",
                margin:"12px 0 0", lineHeight:1.6,
              }}>
                {card.body}
              </p>
            )}
            {active!==card.id && (
              <p style={{ fontFamily:tokens.fontBody, fontSize:"12px", color:tokens.slate3, margin:"8px 0 0" }}>
                Tap to reveal
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 5-MINUTE RESET ────────────────────────────────────────────────────────────
function FiveMinuteReset() {
  const [phase, setPhase] = useState("intro"); // intro | running | done
  const [stepIdx, setStepIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const intervalRef = useRef(null);

  const currentStep = RESET_STEPS[stepIdx];

  useEffect(() => {
    if (phase !== "running") return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          if (stepIdx < RESET_STEPS.length - 1) {
            setStepIdx(i => i + 1);
            setSecondsLeft(60);
          } else {
            setPhase("done");
          }
          return 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase, stepIdx]);

  const start = () => { setPhase("running"); setStepIdx(0); setSecondsLeft(60); };
  const reset = () => { clearInterval(intervalRef.current); setPhase("intro"); setStepIdx(0); setSecondsLeft(60); };

  const progress = phase==="running" ? ((stepIdx * 60 + (60 - secondsLeft)) / (RESET_STEPS.length * 60)) * 100 : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      {/* Header */}
      <Card style={{
        background: phase==="done"
          ? `linear-gradient(135deg,${tokens.sage},${tokens.sage2})`
          : phase==="running"
          ? `linear-gradient(135deg,${currentStep.color},${tokens.sage3})`
          : `linear-gradient(135deg,${tokens.slate},${tokens.slate2})`,
        color: tokens.white,
        textAlign:"center",
        padding:"40px 32px",
        transition:"background 0.6s",
      }}>
        {phase==="intro" && (
          <>
            <div style={{ fontSize:"48px", marginBottom:"12px" }}>🌿</div>
            <h2 style={{ fontFamily:tokens.fontHead, fontSize:"26px", margin:"0 0 10px" }}>5-Minute Reset</h2>
            <p style={{ fontFamily:tokens.fontBody, fontSize:"14px", opacity:0.85, margin:"0 0 24px", maxWidth:"340px", marginLeft:"auto", marginRight:"auto" }}>
              A guided pause for you, the caregiver. Five steps. Five minutes. Just for yourself.
            </p>
            <button onClick={start} style={{
              background:tokens.white, color:tokens.slate,
              border:"none", borderRadius:"24px",
              padding:"14px 36px", fontSize:"16px",
              fontFamily:tokens.fontBody, fontWeight:700,
              cursor:"pointer", boxShadow:`0 4px 16px rgba(0,0,0,0.15)`,
            }}>
              Begin Reset
            </button>
          </>
        )}

        {phase==="running" && (
          <>
            <div style={{ fontSize:"52px", marginBottom:"10px" }}>{currentStep.emoji}</div>
            <div style={{ fontFamily:tokens.fontBody, fontSize:"12px", opacity:0.7, marginBottom:"4px", letterSpacing:"0.08em" }}>
              STEP {stepIdx+1} OF {RESET_STEPS.length}
            </div>
            <h2 style={{ fontFamily:tokens.fontHead, fontSize:"28px", margin:"0 0 12px" }}>{currentStep.title}</h2>
            <p style={{ fontFamily:tokens.fontBody, fontSize:"15px", opacity:0.9, margin:"0 0 24px", maxWidth:"360px", marginLeft:"auto", marginRight:"auto", lineHeight:1.6 }}>
              {currentStep.instruction}
            </p>
            {/* Countdown Ring */}
            <div style={{ position:"relative", display:"inline-block", width:"100px", height:"100px", marginBottom:"16px" }}>
              <svg width="100" height="100" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle cx="50" cy="50" r="44" fill="none" stroke={tokens.white} strokeWidth="6"
                  strokeDasharray={`${2*Math.PI*44}`}
                  strokeDashoffset={`${2*Math.PI*44*(1-secondsLeft/60)}`}
                  style={{ transition:"stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div style={{
                position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                fontFamily:tokens.fontHead, fontSize:"26px", fontWeight:700, color:tokens.white,
              }}>
                {secondsLeft}
              </div>
            </div>
            <div>
              <button onClick={reset} style={{
                background:"rgba(255,255,255,0.2)", color:tokens.white,
                border:"1px solid rgba(255,255,255,0.4)", borderRadius:"20px",
                padding:"8px 24px", fontSize:"13px",
                fontFamily:tokens.fontBody, cursor:"pointer",
              }}>
                Stop
              </button>
            </div>
          </>
        )}

        {phase==="done" && (
          <>
            <div style={{ fontSize:"52px", marginBottom:"12px" }}>💚</div>
            <h2 style={{ fontFamily:tokens.fontHead, fontSize:"28px", margin:"0 0 10px" }}>You did it.</h2>
            <p style={{ fontFamily:tokens.fontBody, fontSize:"15px", opacity:0.9, margin:"0 0 24px", maxWidth:"340px", marginLeft:"auto", marginRight:"auto" }}>
              Five minutes for yourself. That matters. Caregiving is hard. You are enough.
            </p>
            <button onClick={reset} style={{
              background:tokens.white, color:tokens.sage,
              border:"none", borderRadius:"24px",
              padding:"12px 32px", fontSize:"15px",
              fontFamily:tokens.fontBody, fontWeight:700, cursor:"pointer",
            }}>
              Go Again
            </button>
          </>
        )}
      </Card>

      {/* Progress bar */}
      {phase==="running" && (
        <Card style={{ padding:"16px 24px" }}>
          <div style={{ fontFamily:tokens.fontBody, fontSize:"12px", color:tokens.slate2, marginBottom:"8px", display:"flex", justifyContent:"space-between" }}>
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ background:tokens.warm, borderRadius:"8px", height:"8px" }}>
            <div style={{ background:tokens.sage, width:`${progress}%`, height:"100%", borderRadius:"8px", transition:"width 0.5s" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"12px" }}>
            {RESET_STEPS.map((s,i)=>(
              <div key={s.id} style={{ textAlign:"center", flex:1 }}>
                <div style={{ fontSize:"16px", opacity: i<=stepIdx ? 1 : 0.3 }}>{s.emoji}</div>
                <div style={{ fontFamily:tokens.fontBody, fontSize:"10px", color: i<=stepIdx ? tokens.sage : tokens.slate3, marginTop:"2px" }}>{s.title}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Step preview list (only on intro) */}
      {phase==="intro" && (
        <Card>
          <h3 style={{ fontFamily:tokens.fontHead, margin:"0 0 14px", color:tokens.slate }}>What to expect</h3>
          {RESET_STEPS.map((s,i)=>(
            <div key={s.id} style={{
              display:"flex", alignItems:"center", gap:"14px",
              padding:"10px 0",
              borderBottom: i<RESET_STEPS.length-1 ? `1px solid ${tokens.warm}` : "none",
            }}>
              <div style={{
                width:"36px", height:"36px", borderRadius:"50%",
                background:s.color+"30", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:"18px", flexShrink:0,
              }}>{s.emoji}</div>
              <div>
                <div style={{ fontFamily:tokens.fontBody, fontWeight:600, fontSize:"14px", color:tokens.slate }}>{s.title}</div>
                <div style={{ fontFamily:tokens.fontBody, fontSize:"12px", color:tokens.slate2, marginTop:"2px" }}>{s.instruction}</div>
              </div>
              <div style={{ marginLeft:"auto", fontFamily:tokens.fontBody, fontSize:"12px", color:tokens.slate3 }}>1 min</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
const TABS = [
  { id:"dashboard", label:"Dashboard",   component: Dashboard },
  { id:"planner",   label:"Planner",     component: TransitionPlanner },
  { id:"nudges",    label:"Nudge Cards", component: NudgeCards },
  { id:"reset",     label:"5-Min Reset", component: FiveMinuteReset },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const ActiveComponent = TABS.find(t=>t.id===tab)?.component || Dashboard;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${tokens.cream}; min-height: 100vh; }
      `}</style>

      <div style={{ fontFamily:tokens.fontBody, maxWidth:"640px", margin:"0 auto", padding:"0 0 90px" }}>
        {/* Top Nav */}
        <div style={{
          position:"sticky", top:0, zIndex:100,
          background:tokens.white,
          borderBottom:`1px solid ${tokens.warm}`,
          padding:"12px 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          boxShadow:`0 2px 12px ${tokens.shadow}`,
        }}>
          <div style={{ fontFamily:tokens.fontHead, fontSize:"18px", fontWeight:700, color:tokens.sage }}>
            🌿 DementiaCare
          </div>
          <div style={{ fontFamily:tokens.fontBody, fontSize:"12px", color:tokens.slate3 }}>
            For Caregivers
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:"20px 16px" }}>
          <ActiveComponent />
        </div>

        {/* Bottom Tab Bar */}
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:"640px",
          background:tokens.white,
          borderTop:`2px solid ${tokens.warm}`,
          display:"flex",
          boxShadow:`0 -4px 20px ${tokens.shadow}`,
          paddingBottom:"env(safe-area-inset-bottom, 0px)",
        }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1, padding:"12px 4px 10px",
              background: tab===t.id ? tokens.sage3 : "transparent",
              border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:"3px",
              transition:"background 0.2s",
            }}>
              <span style={{ fontSize:"22px", lineHeight:1 }}>
                {t.id==="dashboard"?"🏠":t.id==="planner"?"📋":t.id==="nudges"?"💛":"🌬️"}
              </span>
              <span style={{
                fontFamily:tokens.fontBody, fontSize:"11px",
                color: tab===t.id ? tokens.sage : tokens.slate3,
                fontWeight: tab===t.id ? 700 : 500,
              }}>
                {t.label}
              </span>
              {tab===t.id && (
                <div style={{ width:"20px", height:"3px", background:tokens.sage, borderRadius:"2px" }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}