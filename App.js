import React, { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  bg: "#08090d",
  bg2: "#0f1018",
  bg3: "#161820",
  bg4: "#1e2028",
  bg5: "#252830",
  fire: "#ff6b2b",
  fireLight: "#ff8f5a",
  fireDim: "#ff6b2b33",
  lime: "#c6f135",
  limeLight: "#d8ff5a",
  limeDim: "#c6f13522",
  ice: "#38d9f5",
  iceDim: "#38d9f522",
  rose: "#ff3d7f",
  roseDim: "#ff3d7f22",
  text: "#eef0f6",
  muted: "#7a7f96",
  dim: "#3a3e52",
  border: "#1e2130",
  borderHover: "#2e3248",
};

/* ─── DATA ─── */
const GOALS = [
  { id: "lose", label: "Lose Weight", icon: "🔥", desc: "Burn fat, feel lighter" },
  { id: "build", label: "Build Muscle", icon: "💪", desc: "Gain strength & mass" },
  { id: "habit", label: "Stay Active", icon: "⚡", desc: "Healthy daily habit" },
  { id: "flex", label: "Improve Fitness", icon: "🏃", desc: "Endurance & flexibility" },
];

const WORKOUT_PLANS = [
  {
    id: "beg-home", level: "Beginner", type: "Home",
    name: "Zero to Fit", days: "3x / week", duration: "25 min", cal: 200,
    color: T.lime, colorDim: T.limeDim,
    exercises: [
      { name: "Jumping Jacks", sets: 3, reps: "30 sec", muscle: "Full Body" },
      { name: "Push-Ups", sets: 3, reps: "10 reps", muscle: "Chest" },
      { name: "Bodyweight Squats", sets: 3, reps: "15 reps", muscle: "Legs" },
      { name: "Plank Hold", sets: 3, reps: "20 sec", muscle: "Core" },
      { name: "Mountain Climbers", sets: 2, reps: "20 reps", muscle: "Cardio" },
    ]
  },
  {
    id: "int-gym", level: "Intermediate", type: "Gym",
    name: "Power Push", days: "4x / week", duration: "50 min", cal: 420,
    color: T.fire, colorDim: T.fireDim,
    exercises: [
      { name: "Bench Press", sets: 4, reps: "10 reps", muscle: "Chest" },
      { name: "Incline Dumbbell", sets: 3, reps: "12 reps", muscle: "Chest" },
      { name: "Overhead Press", sets: 4, reps: "10 reps", muscle: "Shoulders" },
      { name: "Lateral Raises", sets: 3, reps: "15 reps", muscle: "Shoulders" },
      { name: "Tricep Dips", sets: 3, reps: "12 reps", muscle: "Triceps" },
      { name: "Cable Flyes", sets: 3, reps: "15 reps", muscle: "Chest" },
    ]
  },
  {
    id: "beg-gym", level: "Beginner", type: "Gym",
    name: "First Steps", days: "3x / week", duration: "40 min", cal: 300,
    color: T.ice, colorDim: T.iceDim,
    exercises: [
      { name: "Leg Press", sets: 3, reps: "12 reps", muscle: "Legs" },
      { name: "Lat Pulldown", sets: 3, reps: "12 reps", muscle: "Back" },
      { name: "Chest Press Machine", sets: 3, reps: "12 reps", muscle: "Chest" },
      { name: "Seated Row", sets: 3, reps: "12 reps", muscle: "Back" },
      { name: "Dumbbell Curls", sets: 3, reps: "12 reps", muscle: "Biceps" },
    ]
  },
  {
    id: "int-home", level: "Intermediate", type: "Home",
    name: "Home Strong", days: "4x / week", duration: "35 min", cal: 280,
    color: T.rose, colorDim: T.roseDim,
    exercises: [
      { name: "Burpees", sets: 3, reps: "12 reps", muscle: "Full Body" },
      { name: "Pike Push-Ups", sets: 3, reps: "10 reps", muscle: "Shoulders" },
      { name: "Jump Squats", sets: 3, reps: "15 reps", muscle: "Legs" },
      { name: "Pull-Ups / Rows", sets: 3, reps: "8 reps", muscle: "Back" },
      { name: "V-Ups", sets: 3, reps: "15 reps", muscle: "Core" },
    ]
  },
];

const BADGES = [
  { id: "first", icon: "🏅", name: "First Workout", desc: "Completed your 1st session", earned: true },
  { id: "week", icon: "🔥", name: "Week Warrior", desc: "7-day streak", earned: true },
  { id: "strong", icon: "💪", name: "Getting Stronger", desc: "10 workouts done", earned: false },
  { id: "month", icon: "🏆", name: "Monthly MVP", desc: "30-day streak", earned: false },
  { id: "early", icon: "🌅", name: "Early Bird", desc: "5 morning workouts", earned: false },
];

const WEEKLY_DATA = [
  { day: "M", min: 45, done: true },
  { day: "T", min: 0, done: false },
  { day: "W", min: 50, done: true },
  { day: "T", min: 35, done: true },
  { day: "F", min: 0, done: false },
  { day: "S", min: 60, done: true },
  { day: "S", min: 0, done: false },
];

/* ─── HELPERS ─── */
const fmt = (n) => n.toLocaleString();
const pct = (a, b) => Math.min(100, Math.round((a / b) * 100));

const Ring = ({ value, max, size = 100, stroke = 9, color, children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct(value, max) / 100);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.bg5} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
};

const ProgressBar = ({ value, max, color, height = 5 }) => (
  <div style={{ height, background: T.bg5, borderRadius: 99, overflow: "hidden" }}>
    <div style={{ width: `${pct(value, max)}%`, height: "100%", background: color, borderRadius: 99, transition: "width .5s ease" }} />
  </div>
);

const Pill = ({ children, color, bg }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, letterSpacing: ".05em", color, background: bg }}>{children}</span>
);

const Btn = ({ children, onClick, full, variant = "primary", style: s = {} }) => {
  const styles = {
    primary: { background: T.fire, color: "#fff" },
    lime: { background: T.lime, color: T.bg },
    ghost: { background: T.bg4, color: T.text, border: `1px solid ${T.border}` },
    outline: { background: "transparent", color: T.fire, border: `1px solid ${T.fire}` },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant], padding: "11px 22px", borderRadius: 12, border: "none",
      fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
      width: full ? "100%" : "auto", transition: "opacity .15s, transform .1s",
      letterSpacing: ".02em", ...s,
    }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(.97)"}
      onMouseUp={e => e.currentTarget.style.transform = ""}
    >{children}</button>
  );
};

const Card = ({ children, style: s = {}, glow }) => (
  <div style={{
    background: T.bg2, border: `1px solid ${glow ? glow + "55" : T.border}`,
    borderRadius: 18, padding: "18px 20px",
    boxShadow: glow ? `0 0 24px ${glow}18` : "none",
    ...s,
  }}>{children}</div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>{children}</div>
);

/* ─── ONBOARDING ─── */
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: "", age: "", gender: "Male", height: "", weight: "", goal: "" });
  const upd = (k, v) => setProfile(p => ({ ...p, [k]: v }));

  const steps = [
    // Step 0: Welcome
    <div style={{ textAlign: "center", padding: "40px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🏋️</div>
      <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 42, fontWeight: 700, color: T.text, letterSpacing: "-.01em", marginBottom: 8 }}>
        WELCOME TO<br /><span style={{ color: T.fire }}>FITTRACK</span>
      </div>
      <div style={{ fontSize: 15, color: T.muted, marginBottom: 40, lineHeight: 1.6 }}>
        Your personal fitness companion.<br />Simple. Consistent. Results.
      </div>
      <Btn full onClick={() => setStep(1)}>Get Started →</Btn>
    </div>,

    // Step 1: Name + Gender
    <div style={{ padding: "32px 24px" }}>
      <div style={{ fontSize: 13, color: T.fire, fontWeight: 600, letterSpacing: ".08em", marginBottom: 8 }}>STEP 1 OF 3</div>
      <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 30, fontWeight: 700, color: T.text, marginBottom: 24 }}>Who are you?</div>
      <div style={{ marginBottom: 16 }}>
        <Label>Your Name</Label>
        <input value={profile.name} onChange={e => upd("name", e.target.value)} placeholder="e.g. Rahul Sharma"
          style={{ width: "100%", background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", color: T.text, fontSize: 15, fontFamily: "inherit", outline: "none" }} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <Label>Gender</Label>
        <div style={{ display: "flex", gap: 10 }}>
          {["Male", "Female", "Other"].map(g => (
            <button key={g} onClick={() => upd("gender", g)} style={{
              flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${profile.gender === g ? T.fire : T.border}`,
              background: profile.gender === g ? T.fireDim : T.bg3, color: profile.gender === g ? T.fire : T.muted,
              fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all .2s",
            }}>{g}</button>
          ))}
        </div>
      </div>
      <Btn full onClick={() => profile.name && setStep(2)}>Continue →</Btn>
    </div>,

    // Step 2: Body stats
    <div style={{ padding: "32px 24px" }}>
      <div style={{ fontSize: 13, color: T.fire, fontWeight: 600, letterSpacing: ".08em", marginBottom: 8 }}>STEP 2 OF 3</div>
      <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 30, fontWeight: 700, color: T.text, marginBottom: 24 }}>Your body stats</div>
      {[["age", "Age (years)", "25"], ["height", "Height (cm)", "175"], ["weight", "Weight (kg)", "72"]].map(([k, label, ph]) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <Label>{label}</Label>
          <input type="number" value={profile[k]} onChange={e => upd(k, e.target.value)} placeholder={ph}
            style={{ width: "100%", background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", color: T.text, fontSize: 15, fontFamily: "inherit", outline: "none" }} />
        </div>
      ))}
      <Btn full onClick={() => profile.age && profile.height && profile.weight && setStep(3)}>Continue →</Btn>
    </div>,

    // Step 3: Goal
    <div style={{ padding: "32px 24px" }}>
      <div style={{ fontSize: 13, color: T.fire, fontWeight: 600, letterSpacing: ".08em", marginBottom: 8 }}>STEP 3 OF 3</div>
      <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 30, fontWeight: 700, color: T.text, marginBottom: 24 }}>Your fitness goal?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {GOALS.map(g => (
          <button key={g.id} onClick={() => upd("goal", g.id)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14,
            border: `1px solid ${profile.goal === g.id ? T.fire : T.border}`,
            background: profile.goal === g.id ? T.fireDim : T.bg3,
            cursor: "pointer", textAlign: "left", transition: "all .2s",
          }}>
            <span style={{ fontSize: 26 }}>{g.icon}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{g.label}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{g.desc}</div>
            </div>
            {profile.goal === g.id && <span style={{ marginLeft: "auto", color: T.fire, fontSize: 18 }}>✓</span>}
          </button>
        ))}
      </div>
      <Btn full onClick={() => profile.goal && onDone(profile)}>Start My Journey 🚀</Btn>
    </div>,
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
        {step > 0 && (
          <div style={{ padding: "20px 24px 0", display: "flex", gap: 6 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? T.fire : T.bg5, transition: "background .3s" }} />
            ))}
          </div>
        )}
        {steps[step]}
      </div>
    </div>
  );
}

/* ─── ACTIVE WORKOUT ─── */
function ActiveWorkout({ plan, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState([]);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(true);
  const ref = useRef();

  useEffect(() => {
    if (running) ref.current = setInterval(() => setTimer(t => t + 1), 1000);
    else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);

  const mins = String(Math.floor(timer / 60)).padStart(2, "0");
  const secs = String(timer % 60).padStart(2, "0");
  const ex = plan.exercises[current];
  const totalDone = done.length;
  const calBurned = Math.round((timer / 60) * (plan.cal / plan.duration));

  const markDone = () => {
    setDone(p => [...p, current]);
    if (current < plan.exercises.length - 1) setCurrent(c => c + 1);
    else onFinish({ duration: timer, cal: calBurned, planName: plan.name });
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "24px 20px" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 12, color: T.muted, letterSpacing: ".06em" }}>ACTIVE</div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 700, color: T.text }}>{plan.name}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 28, fontWeight: 700, color: plan.color }}>{mins}:{secs}</div>
            <button onClick={() => setRunning(r => !r)} style={{ fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer" }}>
              {running ? "⏸ Pause" : "▶ Resume"}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: T.muted }}>Exercise {current + 1} of {plan.exercises.length}</span>
            <span style={{ fontSize: 13, color: plan.color, fontWeight: 600 }}>{totalDone} done</span>
          </div>
          <ProgressBar value={totalDone} max={plan.exercises.length} color={plan.color} height={6} />
        </div>

        {/* Current exercise card */}
        <Card style={{ marginBottom: 16, border: `1px solid ${plan.color}55`, padding: "24px" }} glow={plan.color}>
          <div style={{ fontSize: 12, color: plan.color, fontWeight: 600, letterSpacing: ".08em", marginBottom: 8 }}>{ex.muscle.toUpperCase()}</div>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 34, fontWeight: 700, color: T.text, marginBottom: 12 }}>{ex.name}</div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ background: T.bg4, borderRadius: 10, padding: "10px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontFamily: "Oswald, sans-serif", fontWeight: 700, color: plan.color }}>{ex.sets}</div>
              <div style={{ fontSize: 11, color: T.muted }}>SETS</div>
            </div>
            <div style={{ background: T.bg4, borderRadius: 10, padding: "10px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontFamily: "Oswald, sans-serif", fontWeight: 700, color: plan.color }}>{ex.reps}</div>
              <div style={{ fontSize: 11, color: T.muted }}>REPS / TIME</div>
            </div>
          </div>
        </Card>

        {/* Up next */}
        {current + 1 < plan.exercises.length && (
          <div style={{ background: T.bg3, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 11, color: T.muted }}>UP NEXT</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.muted }}>{plan.exercises[current + 1].name}</div>
          </div>
        )}

        {/* Exercise list */}
        <Card style={{ marginBottom: 20 }}>
          {plan.exercises.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < plan.exercises.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: done.includes(i) ? plan.color : (i === current ? plan.color + "44" : T.bg4), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: done.includes(i) ? T.bg : (i === current ? plan.color : T.dim), fontWeight: 700, flexShrink: 0 }}>
                {done.includes(i) ? "✓" : i + 1}
              </div>
              <div style={{ flex: 1, fontSize: 14, color: done.includes(i) ? T.muted : (i === current ? T.text : T.muted), fontWeight: i === current ? 600 : 400, textDecoration: done.includes(i) ? "line-through" : "none" }}>{e.name}</div>
              <div style={{ fontSize: 12, color: T.dim }}>{e.sets}×{e.reps}</div>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => onFinish(null)} style={{ flex: 1 }}>Quit</Btn>
          <Btn onClick={markDone} style={{ flex: 2, background: plan.color, color: current === plan.exercises.length - 1 ? T.bg : "#fff" }}>
            {current === plan.exercises.length - 1 ? "🏁 Finish Workout" : "Done → Next"}
          </Btn>
        </div>

        {/* Live stats bar */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, background: T.bg3, borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, color: T.fire }}>{calBurned}</div>
            <div style={{ fontSize: 10, color: T.muted }}>CAL</div>
          </div>
          <div style={{ flex: 1, background: T.bg3, borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, color: T.lime }}>{Math.round(timer / 60)}</div>
            <div style={{ fontSize: 10, color: T.muted }}>MINS</div>
          </div>
          <div style={{ flex: 1, background: T.bg3, borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, color: T.ice }}>{totalDone}</div>
            <div style={{ fontSize: 10, color: T.muted }}>DONE</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function FitTrack() {
  const [screen, setScreen] = useState("onboard"); // onboard | app | workout
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [streak, setStreak] = useState(12);
  const [notification, setNotification] = useState(null);

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const handleOnboardDone = (p) => { setProfile(p); setScreen("app"); };

  const handleWorkoutFinish = (result) => {
    if (result) {
      setWorkoutLog(prev => [{ ...result, date: new Date().toLocaleDateString(), id: Date.now() }, ...prev]);
      setStreak(s => s + 1);
      notify(`🎉 Workout done! ${result.cal} cal burned in ${Math.round(result.duration / 60)} min`);
    }
    setActivePlan(null);
    setScreen("app");
    setTab("home");
  };

  if (screen === "onboard") return <Onboarding onDone={handleOnboardDone} />;
  if (screen === "workout" && activePlan) return <ActiveWorkout plan={activePlan} onFinish={handleWorkoutFinish} />;

  const goalLabel = GOALS.find(g => g.id === profile?.goal)?.label || "Stay Fit";
  const totalCal = workoutLog.reduce((s, w) => s + w.cal, 0);
  const totalMin = workoutLog.reduce((s, w) => s + Math.round(w.duration / 60), 0);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: T.text, position: "relative" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Notification */}
      {notification && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: T.bg3, border: `1px solid ${T.fire}55`, color: T.text, padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", boxShadow: `0 0 32px ${T.fire}33` }}>
          {notification}
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 440, margin: "0 auto", paddingBottom: 80 }}>
        {tab === "home" && <HomeTab profile={profile} streak={streak} workoutLog={workoutLog} totalCal={totalCal} totalMin={totalMin} goalLabel={goalLabel} />}
        {tab === "workouts" && <WorkoutsTab onStart={(plan) => { setActivePlan(plan); setScreen("workout"); }} />}
        {tab === "progress" && <ProgressTab profile={profile} workoutLog={workoutLog} streak={streak} totalCal={totalCal} totalMin={totalMin} />}
        {tab === "profile" && <ProfileTab profile={profile} setProfile={setProfile} streak={streak} workoutLog={workoutLog} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.bg2, borderTop: `1px solid ${T.border}`, display: "flex", padding: "8px 0 12px", zIndex: 100 }}>
        {[
          { id: "home", icon: "ti-layout-dashboard", label: "Home" },
          { id: "workouts", icon: "ti-barbell", label: "Workouts" },
          { id: "progress", icon: "ti-trending-up", label: "Progress" },
          { id: "profile", icon: "ti-user", label: "Profile" },
        ].map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            border: "none", background: "none", cursor: "pointer", padding: "6px 0",
            color: tab === item.id ? T.fire : T.dim, transition: "color .2s",
          }}>
            <i className={`ti ${item.icon}`} style={{ fontSize: 22 }} />
            <span style={{ fontSize: 10, fontWeight: tab === item.id ? 600 : 400, letterSpacing: ".03em" }}>{item.label}</span>
            {tab === item.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.fire, marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── HOME TAB ─── */
function HomeTab({ profile, streak, workoutLog, totalCal, totalMin, goalLabel }) {
  const todayDone = workoutLog[0]?.date === new Date().toLocaleDateString();
  const weekDone = WEEKLY_DATA.filter(d => d.done).length;

  return (
    <div style={{ padding: "28px 20px 0" }}>
      {/* Greeting */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 2 }}>Good morning 👋</div>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1 }}>
            {profile?.name?.split(" ")[0] || "Athlete"}
          </div>
          <div style={{ marginTop: 6 }}>
            <Pill color={T.fire} bg={T.fireDim}>{goalLabel}</Pill>
          </div>
        </div>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: T.fireDim, border: `2px solid ${T.fire}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 18, color: T.fire }}>
          {profile?.name?.[0]?.toUpperCase() || "A"}
        </div>
      </div>

      {/* Today's summary hero */}
      <Card style={{ marginBottom: 14, padding: "20px" }} glow={T.fire}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Ring value={todayDone ? 3 : 0} max={3} color={T.fire} size={96} stroke={8}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, fontWeight: 700, color: T.fire }}>{todayDone ? "✓" : "0/3"}</div>
            <div style={{ fontSize: 9, color: T.muted }}>GOALS</div>
          </Ring>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 10 }}>Today's Activity</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: T.muted }}>Workout</span>
                <span style={{ fontSize: 12, color: T.text }}>{todayDone ? "Done ✓" : "0 / 1"}</span>
              </div>
              <ProgressBar value={todayDone ? 1 : 0} max={1} color={T.fire} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: T.muted }}>Calories</span>
                <span style={{ fontSize: 12, color: T.text }}>{workoutLog[0]?.cal || 0} burned</span>
              </div>
              <ProgressBar value={workoutLog[0]?.cal || 0} max={500} color={T.lime} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: T.muted }}>Weekly streak</span>
                <span style={{ fontSize: 12, color: T.text }}>{weekDone} / 7 days</span>
              </div>
              <ProgressBar value={weekDone} max={7} color={T.ice} />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Streak", value: `${streak}d`, color: T.fire, icon: "🔥" },
          { label: "Cal Burned", value: fmt(totalCal), color: T.lime, icon: "⚡" },
          { label: "Sessions", value: workoutLog.length, color: T.ice, icon: "🏋️" },
        ].map(s => (
          <div key={s.label} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Weekly grid */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 14 }}>This Week</div>
        <div style={{ display: "flex", gap: 6 }}>
          {WEEKLY_DATA.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: "100%", background: d.done ? T.fire : T.bg4, borderRadius: "4px 4px 0 0", height: d.min > 0 ? `${Math.max(20, d.min * 1.2)}px` : "20px", minHeight: 8, transition: "height .4s" }} />
              <div style={{ fontSize: 10, color: d.done ? T.fire : T.dim, fontWeight: d.done ? 600 : 400 }}>{d.day}</div>
              {d.done && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.fire }} />}
            </div>
          ))}
        </div>
      </Card>

      {/* Recent workout */}
      {workoutLog.length > 0 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 12 }}>Recent Session</div>
          {workoutLog.slice(0, 2).map(w => (
            <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.fireDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔥</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{w.planName}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{w.date} · {Math.round(w.duration / 60)} min</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.fire }}>{w.cal} cal</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {workoutLog.length === 0 && (
        <Card style={{ textAlign: "center", padding: "28px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💪</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>No workouts yet!</div>
          <div style={{ fontSize: 13, color: T.muted }}>Head to Workouts and start your first session</div>
        </Card>
      )}
    </div>
  );
}

/* ─── WORKOUTS TAB ─── */
function WorkoutsTab({ onStart }) {
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Beginner", "Intermediate", "Home", "Gym"];
  const filtered = WORKOUT_PLANS.filter(p => filter === "All" || p.level === filter || p.type === filter);

  return (
    <div style={{ padding: "28px 20px 0" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 30, fontWeight: 700, color: T.text, marginBottom: 4 }}>WORKOUT PLANS</div>
        <div style={{ fontSize: 13, color: T.muted }}>50+ exercises · Home & Gym</div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 18 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter === f ? T.fire : T.border}`,
            background: filter === f ? T.fireDim : T.bg3, color: filter === f ? T.fire : T.muted,
            fontSize: 13, fontWeight: filter === f ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap",
            fontFamily: "inherit",
          }}>{f}</button>
        ))}
      </div>

      {/* Plan cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(plan => (
          <Card key={plan.id} style={{ padding: "20px" }} glow={plan.color}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <Pill color={plan.color} bg={plan.colorDim}>{plan.level}</Pill>
                  <Pill color={T.muted} bg={T.bg4}>{plan.type}</Pill>
                </div>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 26, fontWeight: 700, color: T.text }}>{plan.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, color: plan.color }}>{plan.cal}</div>
                <div style={{ fontSize: 10, color: T.muted }}>CAL</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {[["📅", plan.days], ["⏱", plan.duration], ["🏋️", `${plan.exercises.length} exercises`]].map(([icon, val]) => (
                <div key={val} style={{ background: T.bg4, borderRadius: 8, padding: "6px 10px", fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>{icon}</span>{val}
                </div>
              ))}
            </div>

            {/* Exercise preview */}
            <div style={{ marginBottom: 16 }}>
              {plan.exercises.slice(0, 3).map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.colorDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: plan.color, fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: 13, color: T.text }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{e.sets}×{e.reps}</div>
                </div>
              ))}
              {plan.exercises.length > 3 && (
                <div style={{ fontSize: 12, color: T.muted, paddingTop: 6 }}>+{plan.exercises.length - 3} more exercises</div>
              )}
            </div>

            <button onClick={() => onStart(plan)} style={{
              width: "100%", padding: "13px", borderRadius: 12, border: "none",
              background: plan.color, color: plan.color === T.lime ? T.bg : "#fff",
              fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 700,
              cursor: "pointer", letterSpacing: ".05em", transition: "opacity .15s",
            }}>START WORKOUT →</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── PROGRESS TAB ─── */
function ProgressTab({ profile, workoutLog, streak, totalCal, totalMin }) {
  const [weightLog, setWeightLog] = useState([
    { date: "Jun 10", val: 78.0 }, { date: "Jun 17", val: 76.5 },
    { date: "Jun 24", val: 75.2 }, { date: "Jul 1", val: 74.0 },
    { date: "Jul 8", val: 73.1 }, { date: "Jul 15", val: 72.4 },
  ]);
  const [newWeight, setNewWeight] = useState("");
  const startW = parseFloat(profile?.weight) || 78;
  const currentW = weightLog[weightLog.length - 1]?.val || startW;
  const lost = (startW - currentW).toFixed(1);
  const maxW = Math.max(...weightLog.map(w => w.val));
  const minW = Math.min(...weightLog.map(w => w.val));

  const addWeight = () => {
    if (!newWeight) return;
    const today = new Date().toLocaleDateString("en", { month: "short", day: "numeric" });
    setWeightLog(p => [...p, { date: today, val: parseFloat(newWeight) }]);
    setNewWeight("");
  };

  const monthlyData = [
    { label: "May", count: 10 }, { label: "Jun", count: 14 }, { label: "Jul", count: workoutLog.length + 8 },
  ];
  const maxCount = Math.max(...monthlyData.map(m => m.count));

  return (
    <div style={{ padding: "28px 20px 0" }}>
      <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 30, fontWeight: 700, color: T.text, marginBottom: 4 }}>PROGRESS</div>
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>Your fitness journey</div>

      {/* Big stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Current Streak", value: `${streak} days`, color: T.fire, icon: "🔥" },
          { label: "Workouts Done", value: workoutLog.length + 12, color: T.lime, icon: "💪" },
          { label: "Total Calories", value: `${fmt(totalCal + 4200)} cal`, color: T.ice, icon: "⚡" },
          { label: "Active Minutes", value: `${totalMin + 340} min`, color: T.rose, icon: "⏱" },
        ].map(s => (
          <div key={s.label} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Weight tracker */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Weight Tracker</div>
            <div style={{ fontSize: 12, color: T.muted }}>
              {lost > 0 ? `↓ ${lost} kg lost` : `↑ ${Math.abs(lost)} kg gained`}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, color: T.lime }}>{currentW} kg</div>
            <div style={{ fontSize: 11, color: T.muted }}>current</div>
          </div>
        </div>

        {/* SVG weight chart */}
        <div style={{ position: "relative", height: 80, marginBottom: 12 }}>
          <svg width="100%" height="80" viewBox={`0 0 ${weightLog.length * 50} 80`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.lime} stopOpacity=".25" />
                <stop offset="100%" stopColor={T.lime} stopOpacity="0" />
              </linearGradient>
            </defs>
            {weightLog.map((w, i) => {
              const x = i * 50 + 25;
              const range = maxW - minW || 1;
              const y = 10 + ((maxW - w.val) / range) * 55;
              const next = weightLog[i + 1];
              const nx = next ? (i + 1) * 50 + 25 : x;
              const ny = next ? 10 + ((maxW - next.val) / range) * 55 : y;
              return (
                <g key={i}>
                  {next && <line x1={x} y1={y} x2={nx} y2={ny} stroke={T.lime} strokeWidth="2" strokeLinecap="round" />}
                  <circle cx={x} cy={y} r="4" fill={T.lime} />
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
          {weightLog.map((w, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 44 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: i === weightLog.length - 1 ? T.lime : T.muted }}>{w.val}</div>
              <div style={{ fontSize: 10, color: T.dim }}>{w.date}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="Log weight (kg)" step="0.1"
            style={{ flex: 1, background: T.bg4, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          <Btn variant="lime" onClick={addWeight}>Log</Btn>
        </div>
      </Card>

      {/* Monthly workouts */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 16 }}>Monthly Workouts</div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", height: 80 }}>
          {monthlyData.map(m => (
            <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 12, color: T.fire, fontWeight: 600 }}>{m.count}</div>
              <div style={{ width: "100%", background: T.fire, borderRadius: "4px 4px 0 0", height: `${(m.count / maxCount) * 60}px` }} />
              <div style={{ fontSize: 12, color: T.muted }}>{m.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 14 }}>Achievements</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {BADGES.map(b => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, opacity: b.earned ? 1 : 0.4 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: b.earned ? T.fireDim : T.bg4, border: `1px solid ${b.earned ? T.fire + "55" : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{b.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: b.earned ? T.text : T.muted }}>{b.name}</div>
                <div style={{ fontSize: 12, color: T.dim }}>{b.desc}</div>
              </div>
              {b.earned && <Pill color={T.lime} bg={T.limeDim}>Earned</Pill>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── PROFILE TAB ─── */
function ProfileTab({ profile, setProfile, streak, workoutLog }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const save = () => { setProfile(form); setEditing(false); };
  const goalInfo = GOALS.find(g => g.id === (form.goal || profile?.goal));

  return (
    <div style={{ padding: "28px 20px 0" }}>
      {/* Profile hero */}
      <Card style={{ textAlign: "center", padding: "28px 20px", marginBottom: 14 }} glow={T.fire}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.fireDim, border: `2px solid ${T.fire}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 28, color: T.fire, margin: "0 auto 14px" }}>
          {profile?.name?.[0]?.toUpperCase() || "A"}
        </div>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 4 }}>{profile?.name}</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>{profile?.gender} · {profile?.age} yrs</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <Pill color={T.fire} bg={T.fireDim}>{goalInfo?.icon} {goalInfo?.label}</Pill>
          <Pill color={T.lime} bg={T.limeDim}>🔥 {streak} day streak</Pill>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Weight", value: `${profile?.weight}kg`, icon: "⚖️" },
          { label: "Height", value: `${profile?.height}cm`, icon: "📏" },
          { label: "Sessions", value: workoutLog.length + 12, icon: "🏋️" },
        ].map(s => (
          <div key={s.label} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, fontWeight: 700, color: T.text }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Edit profile */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Personal Info</div>
          <button onClick={() => editing ? save() : setEditing(true)} style={{
            padding: "6px 14px", borderRadius: 8, border: `1px solid ${editing ? T.lime : T.border}`,
            background: editing ? T.limeDim : "transparent", color: editing ? T.lime : T.muted,
            fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>{editing ? "Save ✓" : "Edit"}</button>
        </div>

        {[["name", "Name", "text"], ["age", "Age", "number"], ["height", "Height (cm)", "number"], ["weight", "Weight (kg)", "number"]].map(([k, label, type]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <Label>{label}</Label>
            {editing
              ? <input type={type} value={form[k]} onChange={e => upd(k, e.target.value)}
                style={{ width: "100%", background: T.bg4, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
              : <div style={{ fontSize: 15, color: T.text, padding: "4px 0" }}>{profile?.[k]}</div>
            }
          </div>
        ))}

        {editing && (
          <div>
            <Label>Fitness Goal</Label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {GOALS.map(g => (
                <button key={g.id} onClick={() => upd("goal", g.id)} style={{
                  padding: "6px 12px", borderRadius: 8, border: `1px solid ${form.goal === g.id ? T.fire : T.border}`,
                  background: form.goal === g.id ? T.fireDim : T.bg4, color: form.goal === g.id ? T.fire : T.muted,
                  fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                }}>{g.icon} {g.label}</button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Notifications */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 14 }}>Reminders</div>
        {[
          { label: "Daily workout reminder", time: "7:00 AM", on: true },
          { label: "Motivation push", time: "9:00 AM", on: true },
          { label: "Rest day reminder", time: "6:00 PM", on: false },
        ].map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
            <div>
              <div style={{ fontSize: 14, color: T.text }}>{n.label}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{n.time}</div>
            </div>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: n.on ? T.fire : T.bg5, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: n.on ? 21 : 3, transition: "left .2s" }} />
            </div>
          </div>
        ))}
      </Card>

      {/* App info */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 12 }}>FitTrack</div>
        {[["Version", "1.0 MVP"], ["Plan", "Free"], ["Goal completion", `${Math.min(100, workoutLog.length * 8)}%`]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 13, color: T.muted }}>{k}</span>
            <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

