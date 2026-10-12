import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BookOpen, PencilRuler, Compass, Timer, CheckCircle2, XCircle,
  Clock, FileText, BarChart3, LineChart, PieChart, GitBranch,
  Map as MapIcon, ListChecks, Eye, EyeOff, RotateCcw, Award, ChevronRight,
  Newspaper, Heading, ScanSearch, Layers, PenLine
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ReadingHome, ReadingTypesView, HeadingsLab,
  ReadingExercises, ReadingGuided, ReadingMock,
} from "./reading";

type Course = "writing" | "reading";
type Section = "home" | "lessons" | "exercises" | "guided" | "mock" | "vocab";
type RSection = "rhome" | "rtypes" | "rheadings" | "rex" | "rguided" | "rmock";

const NAV: { id: Section; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "home", label: "Dashboard", icon: <BookOpen className="h-4 w-4" />, desc: "Start here" },
  { id: "lessons", label: "Lesson Notes", icon: <FileText className="h-4 w-4" />, desc: "6 core lessons" },
  { id: "exercises", label: "Exercises", icon: <PencilRuler className="h-4 w-4" />, desc: "Auto-marked drills" },
  { id: "guided", label: "Guided Practice", icon: <Compass className="h-4 w-4" />, desc: "Step-by-step writing" },
  { id: "mock", label: "Mock Exam", icon: <Timer className="h-4 w-4" />, desc: "20-min timed test" },
  { id: "vocab", label: "Vocab Bank", icon: <ListChecks className="h-4 w-4" />, desc: "Band 7+ phrases" },
];

const READ_NAV: { id: RSection; label: string; icon: React.ReactNode }[] = [
  { id: "rhome", label: "Reading Hub", icon: <Newspaper className="h-4 w-4" /> },
  { id: "rtypes", label: "All 10 Question Types", icon: <Layers className="h-4 w-4" /> },
  { id: "rheadings", label: "Match Headings Lab", icon: <Heading className="h-4 w-4" /> },
  { id: "rex", label: "Exercises", icon: <PencilRuler className="h-4 w-4" /> },
  { id: "rguided", label: "Guided Reading", icon: <ScanSearch className="h-4 w-4" /> },
  { id: "rmock", label: "Mock Test", icon: <Timer className="h-4 w-4" /> },
];

// ---------- helpers ----------
function countWords(s: string) {
  return s.trim() === "" ? 0 : s.trim().split(/\s+/).length;
}
function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) as T : initial; } catch { return initial; }
  });
  const set = (v: T) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* noop */ } };
  return [val, set];
}

// ---------- small chart visuals (CSS/SVG, no lib) ----------
function LineChartVisual() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Coffee consumption (kg per person), 1990–2020</p>
      <svg viewBox="0 0 400 180" className="mt-2 w-full">
        <line x1="40" y1="10" x2="40" y2="150" stroke="#a8a29e" />
        <line x1="40" y1="150" x2="390" y2="150" stroke="#a8a29e" />
        {[30, 70, 110, 150].map((y) => <line key={y} x1="40" y1={y} x2="390" y2={y} stroke="#e7e5e4" />)}
        <polyline points="40,120 120,100 200,85 280,50 360,40" fill="none" stroke="#0f766e" strokeWidth="3" />
        <polyline points="40,130 120,125 200,115 280,110 360,105" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="6 4" />
        <circle cx="280" cy="50" r="5" fill="#0f766e" />
        <text x="285" y="45" fontSize="11" fill="#0f766e" fontWeight="700">UK 5.2kg</text>
        <text x="60" y="165" fontSize="10" fill="#78716c">1990</text>
        <text x="340" y="165" fontSize="10" fill="#78716c">2020</text>
      </svg>
      <div className="mt-1 flex gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 bg-teal-700" /> UK</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 bg-amber-600" /> France</span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1 text-center text-[11px] text-stone-600">
        {[["1990","2.1","1.8"],["2000","3.0","2.2"],["2010","4.4","2.5"],["2020","5.2","2.6"]].map(([y,a,b]) => (
          <div key={y} className="rounded bg-stone-100 px-1 py-1"><span className="font-bold text-stone-800">{y}</span><br/>UK {a}<br/>FR {b}</div>
        ))}
      </div>
    </div>
  );
}
function BarChartVisual() {
  const rows = [
    { c: "Australia", v: 28, w: "92%" },
    { c: "UK", v: 19, w: "62%" },
    { c: "Canada", v: 15, w: "49%" },
    { c: "USA", v: 11, w: "36%" },
  ];
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Net migration per 1,000 people, 2023 (mock data)</p>
      <div className="mt-3 space-y-2">
        {rows.map(r => (
          <div key={r.c} className="flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0 text-stone-700">{r.c}</span>
            <div className="h-6 flex-1 rounded bg-stone-100"><div className="h-6 rounded bg-teal-700" style={{ width: r.w }} /></div>
            <span className="w-8 text-right font-bold">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function PieTableVisual() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-stone-200 bg-white p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Energy source share, 2020</p>
        <svg viewBox="0 0 120 120" className="mx-auto mt-2 h-32 w-32">
          <circle cx="60" cy="60" r="50" fill="#e7e5e4" />
          <path d="M60 60 L60 10 A50 50 0 0 1 108 75 Z" fill="#0f766e" />
          <path d="M60 60 L108 75 A50 50 0 0 1 60 110 Z" fill="#d97706" />
          <text x="72" y="40" fontSize="9" fill="#fff" fontWeight="700">Gas 38%</text>
          <text x="70" y="85" fontSize="9" fill="#fff" fontWeight="700">Coal 27%</text>
          <text x="28" y="65" fontSize="9" fill="#57534e" fontWeight="700">Other 35%</text>
        </svg>
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Table: households with internet (%)</p>
        <table className="mt-2 w-full text-sm">
          <thead><tr className="border-b text-left text-stone-500"><th className="py-1">Country</th><th>2010</th><th>2020</th></tr></thead>
          <tbody>
            {[["Korea","82","98"],["UK","73","94"],["Brazil","34","71"]].map(r => (
              <tr key={r[0]} className="border-b border-stone-100"><td className="py-1 font-medium">{r[0]}</td><td>{r[1]}</td><td className="font-bold">{r[2]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- MAIN ----------
export default function App() {
  const [course, setCourse] = useState<Course>("writing");
  const [section, setSection] = useState<Section>("home");
  const [rsection, setRsection] = useState<RSection>("rhome");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [doneLessons, setDoneLessons] = useLocalStorage<string[]>("wt1-done", []);
  const [bestScores, setBestScores] = useLocalStorage<Record<string, number>>("wt1-scores", {});
  const [guidedDone, setGuidedDone] = useLocalStorage<boolean>("wt1-guided-done", false);
  const [readScores, setReadScores] = useLocalStorage<Record<string, number>>("read-scores", {});

  const lessonsTotal = 6;
  const progress = Math.round((doneLessons.length / lessonsTotal) * 100);

  const markLesson = (id: string) => {
    if (!doneLessons.includes(id)) setDoneLessons([...doneLessons, id]);
  };

  const goWriting = (s: Section) => { setCourse("writing"); setSection(s); };
  const goReading = (s: RSection) => { setCourse("reading"); setRsection(s); };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#1c1917] text-stone-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button onClick={() => { setCourse("writing"); setSection("home"); }} className="flex items-center gap-3 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 font-serif text-lg font-bold">7+</span>
            <span>
              <span className="block font-serif text-base font-bold leading-tight">IELTS Academic: Writing Task 1 + Reading</span>
              <span className="block text-xs text-stone-400">Complete prep course · Band descriptors · Timed mocks</span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md bg-stone-800 p-1">
              <button onClick={() => setCourse("writing")}
                className={cn("flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold", course === "writing" ? "bg-stone-100 text-stone-900" : "text-stone-300 hover:text-white")}>
                <PenLine className="h-4 w-4" /> Writing
              </button>
              <button onClick={() => setCourse("reading")}
                className={cn("flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold", course === "reading" ? "bg-stone-100 text-stone-900" : "text-stone-300 hover:text-white")}>
                <Newspaper className="h-4 w-4" /> Reading
              </button>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              {course === "writing" ? (
                <>
                  <Badge variant="secondary" className="bg-stone-800 text-stone-200">{doneLessons.length}/{lessonsTotal} lessons</Badge>
                  <Button size="sm" className="bg-teal-700 hover:bg-teal-800" onClick={() => setSection("mock")}><Timer className="mr-1 h-4 w-4" /> Mock exam</Button>
                </>
              ) : (
                <Button size="sm" className="bg-teal-700 hover:bg-teal-800" onClick={() => setRsection("rmock")}><Timer className="mr-1 h-4 w-4" /> Reading mock</Button>
              )}
              <Badge variant="secondary" className="bg-amber-600 text-white">Target Band 7+</Badge>
            </div>
          </div>
        </div>
        <nav className="border-t border-stone-800">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
            {course === "writing" ? NAV.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)}
                className={cn("flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm",
                  section === n.id ? "bg-stone-100 text-stone-900 font-semibold" : "text-stone-300 hover:bg-stone-800 hover:text-white")}>
                {n.icon}{n.label}
              </button>
            )) : READ_NAV.map(n => (
              <button key={n.id} onClick={() => setRsection(n.id)}
                className={cn("flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm",
                  rsection === n.id ? "bg-stone-100 text-stone-900 font-semibold" : "text-stone-300 hover:bg-stone-800 hover:text-white")}>
                {n.icon}{n.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {course === "writing" ? (
          <>
            {section === "home" && <HomeView go={setSection} goReading={goReading} progress={progress} doneLessons={doneLessons} bestScores={bestScores} />}
            {section === "lessons" && <LessonsView idx={lessonIdx} setIdx={setLessonIdx} done={doneLessons} mark={markLesson} go={setSection} />}
            {section === "exercises" && <ExercisesView save={(k, s) => setBestScores({ ...bestScores, [k]: Math.max(bestScores[k] ?? 0, s) })} best={bestScores} />}
            {section === "guided" && <GuidedView done={guidedDone} setDone={setGuidedDone} />}
            {section === "mock" && <MockView />}
            {section === "vocab" && <VocabView />}
          </>
        ) : (
          <>
            {rsection === "rhome" && <ReadingHome go={goReading} goWriting={goWriting} scores={readScores} />}
            {rsection === "rtypes" && <ReadingTypesView />}
            {rsection === "rheadings" && <HeadingsLab />}
            {rsection === "rex" && <ReadingExercises save={(k, s) => setReadScores({ ...readScores, [k]: Math.max(readScores[k] ?? 0, s) })} best={readScores} />}
            {rsection === "rguided" && <ReadingGuided />}
            {rsection === "rmock" && <ReadingMock />}
          </>
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-sm text-stone-500">
          {course === "writing" ? (
            <>
              <p className="font-semibold text-stone-700">Study tip: 20 minutes = 3 min plan + 14 min write + 3 min check.</p>
              <p className="mt-1">Minimum 150 words. No opinion, no personal pronouns, no data copying without overview. All sample data on this page is simplified for practice.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-stone-700">Reading tip: 60 minutes = ~17 min per passage + transfer time. No extra transfer time on computer-delivered IELTS.</p>
              <p className="mt-1">40 questions, 3 passages, always in order except matching sets. All practice texts here are original and simplified for training.</p>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}

// ================= HOME =================
function HomeView({ go, goReading, progress, doneLessons, bestScores }: { go: (s: Section) => void; goReading: (s: RSection) => void; progress: number; doneLessons: string[]; bestScores: Record<string, number> }) {
  const cards = [
    { id: "lessons" as Section, title: "1 · Lesson notes", icon: <FileText className="h-5 w-5" />, text: "Task types, 4-paragraph structure, paraphrase, overview, trend & comparison language, process/maps.", cta: doneLessons.length === 0 ? "Start Lesson 1" : "Continue lessons" },
    { id: "exercises" as Section, title: "2 · Exercises", icon: <PencilRuler className="h-5 w-5" />, text: "18 auto-marked questions: paraphrase, overview spotting, verb accuracy, data grouping.", cta: "Practise drills" },
    { id: "guided" as Section, title: "3 · Guided practice", icon: <Compass className="h-5 w-5" />, text: "Write a line graph + a process with sentence starters, hints and Band 9 model.", cta: "Write with guidance" },
    { id: "mock" as Section, title: "4 · Mock exam", icon: <Timer className="h-5 w-5" />, text: "Real conditions: bar-chart prompt, 20:00 countdown, word counter, self-marking rubric.", cta: "Start mock" },
  ];
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-stone-200">
          <CardHeader>
            <Badge className="w-fit bg-teal-700">Academic · Task 1 · 150+ words · 20 mins</Badge>
            <CardTitle className="mt-2 font-serif text-3xl leading-tight">Describe data clearly.<br />Never guess why.</CardTitle>
            <CardDescription className="text-base">Examiners mark 4 things: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammar. This course trains each one separately, then combines them.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm"><span className="font-semibold">Course progress</span><span>{progress}%</span></div>
            <Progress value={progress} className="mt-2" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => go("lessons")} className="bg-stone-900 hover:bg-stone-800">Start learning <ChevronRight className="ml-1 h-4 w-4" /></Button>
              <Button variant="outline" onClick={() => go("vocab")}>Vocab bank</Button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
              {[["TA", "Overview + key features"], ["CC", "4 paras + linkers"], ["LR", "Trend & compare"], ["GRA", "Tense + passives"]].map(([a, b]) => (
                <div key={a} className="rounded-md bg-stone-100 p-2"><p className="font-serif text-lg font-bold">{a}</p><p className="text-stone-600">{b}</p></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader><CardTitle className="font-serif text-xl">The 4-paragraph method</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[["P1 · Introduction", "Paraphrase the prompt in 1–2 sentences. Never copy."],
              ["P2 · Overview", "2–3 main trends / differences. No numbers. Use 'Overall...'."],
              ["P3 · Detail 1", "First group of data with figures. Compare, don't list."],
              ["P4 · Detail 2", "Second group. 160–190 words total is ideal."]].map(([t, d]) => (
              <div key={t} className="rounded-md border border-amber-200 bg-white p-2.5"><p className="font-bold">{t}</p><p className="text-stone-600">{d}</p></div>
            ))}
            <Alert className="bg-white"><AlertTitle>Golden rule</AlertTitle><AlertDescription>Every chart = introduction + overview + 2 detail paragraphs. Processes/maps use the same skeleton with stages/locations instead.</AlertDescription></Alert>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(c => (
          <Card key={c.id} className="flex flex-col border-stone-200">
            <CardHeader><span className="flex h-9 w-9 items-center justify-center rounded-md bg-stone-900 text-white">{c.icon}</span>
              <CardTitle className="mt-2 font-serif text-lg">{c.title}</CardTitle>
              <CardDescription>{c.text}</CardDescription></CardHeader>
            <CardContent className="mt-auto"><Button variant="outline" className="w-full" onClick={() => go(c.id)}>{c.cta}</Button></CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-4 border-teal-700 bg-teal-50">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="font-serif text-lg font-bold">Also preparing for Academic Reading?</p>
            <p className="text-sm text-stone-600">New: full Reading course — all 10 question types, Match Headings lab, guided passage + timed mock.</p>
          </div>
          <Button onClick={() => goReading("rhome")} className="bg-teal-700 hover:bg-teal-800"><Newspaper className="mr-1 h-4 w-4" /> Open Reading Hub</Button>
        </CardContent>
      </Card>
      {Object.keys(bestScores).length > 0 && (
        <Card className="mt-4 border-stone-200"><CardHeader><CardTitle className="text-base">Your best exercise scores</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">{Object.entries(bestScores).map(([k, v]) => <Badge key={k} variant="secondary">{k}: {v}%</Badge>)}</CardContent></Card>
      )}
    </div>
  );
}

// ================= LESSONS =================
const LESSONS = [
  { id: "L1", title: "What examiners want", time: "12 min", icon: <Award className="h-4 w-4" /> },
  { id: "L2", title: "Structure & timing", time: "10 min", icon: <FileText className="h-4 w-4" /> },
  { id: "L3", title: "Paraphrase + Overview", time: "15 min", icon: <Eye className="h-4 w-4" /> },
  { id: "L4", title: "Trend language (dynamic)", time: "15 min", icon: <LineChart className="h-4 w-4" /> },
  { id: "L5", title: "Compare & static charts", time: "15 min", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "L6", title: "Process & maps", time: "15 min", icon: <GitBranch className="h-4 w-4" /> },
];

function LessonsView({ idx, setIdx, done, mark, go }: { idx: number; setIdx: (n: number) => void; done: string[]; mark: (id: string) => void; go: (s: Section) => void }) {
  const L = LESSONS[idx];
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <Card className="h-fit border-stone-200 lg:sticky lg:top-32">
        <CardHeader><CardTitle className="text-base">Lesson notes</CardTitle><CardDescription>Work in order. Tick when done.</CardDescription></CardHeader>
        <CardContent className="space-y-1">
          {LESSONS.map((l, i) => (
            <button key={l.id} onClick={() => setIdx(i)}
              className={cn("flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm",
                i === idx ? "bg-stone-900 text-white" : "hover:bg-stone-100")}>
              <span className="font-mono text-xs opacity-70">{l.id}</span>
              <span className="flex-1 font-medium">{l.title}</span>
              {done.includes(l.id) ? <CheckCircle2 className="h-4 w-4 text-teal-500" /> : <span className="text-xs opacity-60">{l.time}</span>}
            </button>
          ))}
        </CardContent>
      </Card>
      <div>
        <Card className="border-stone-200">
          <CardHeader>
            <div className="flex items-center gap-2"><Badge variant="outline">{L.id}</Badge><Badge variant="secondary">{L.time}</Badge></div>
            <CardTitle className="font-serif text-2xl">{L.title}</CardTitle>
          </CardHeader>
          <CardContent><LessonBody id={L.id} /></CardContent>
        </Card>
        <div className="mt-3 flex items-center justify-between">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Previous</Button>
          <Button variant={done.includes(L.id) ? "secondary" : "default"} className={done.includes(L.id) ? "" : "bg-teal-700 hover:bg-teal-800"}
            onClick={() => mark(L.id)}>{done.includes(L.id) ? "Completed ✓" : "Mark as complete"}</Button>
          {idx < LESSONS.length - 1
            ? <Button onClick={() => setIdx(idx + 1)}>Next lesson</Button>
            : <Button onClick={() => go("exercises")}>Go to exercises</Button>}
        </div>
      </div>
    </div>
  );
}

function LessonBody({ id }: { id: string }) {
  if (id === "L1") return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <p>Task 1 is <strong>not an essay</strong>. You summarise visual information in <strong>at least 150 words in ~20 minutes</strong>. Chart types: line, bar, pie, table, process, map, or mixed (two visuals).</p>
      <div className="overflow-x-auto rounded-lg border"><table className="w-full text-sm">
        <thead><tr className="bg-stone-900 text-left text-white"><th className="p-2">Criterion (25%)</th><th className="p-2">Band 6 problem</th><th className="p-2">Band 7+ fix</th></tr></thead>
        <tbody>
          {[["Task Achievement", "No clear overview; too much detail", "Clear overview + key features + data support"],
            ["Coherence & Cohesion", "Paragraphs unclear; over-linked", "4 paragraphs, logical grouping, varied linkers"],
            ["Lexical Resource", "Repeats 'increase, big, good'", "Trend verbs, comparison, approximation"],
            ["Grammar", "Only simple sentences, tense errors", "Mix simple/complex, correct tense, passive for process"]].map(r => (
            <tr key={r[0]} className="border-t"><td className="p-2 font-bold">{r[0]}</td><td className="p-2">{r[1]}</td><td className="p-2">{r[2]}</td></tr>))}
        </tbody></table></div>
      <Alert><AlertTitle>What loses marks fastest</AlertTitle><AlertDescription><ul className="list-disc pl-5 text-sm"><li>Under 150 words = automatic penalty.</li><li>No overview paragraph = max Band 5 for Task Achievement.</li><li>Giving reasons/opinions (“because people like coffee”) = off-task.</li><li>Copying the prompt word-for-word in the introduction.</li></ul></AlertDescription></Alert>
    </div>
  );
  if (id === "L2") return (
    <div className="space-y-3 text-[15px] leading-relaxed">
      <p>Use this skeleton for <strong>every</strong> Task 1. It saves planning time and guarantees cohesion.</p>
      <div className="grid gap-2 md:grid-cols-2">
        {[["Introduction (2 sentences)", "Paraphrase: chart type + what + where + when. E.g. 'The line graph compares…'"],
          ["Overview (2–3 sentences, NO numbers)", "Start 'Overall,…'. Give 2 big patterns: highest/lowest, rising vs falling, biggest change."],
          ["Details A (5–6 sentences)", "Group 1: e.g. the lines that rose. Give start/end figures + compare."],
          ["Details B (5–6 sentences)", "Group 2: the rest. Same pattern. Aim 160–190 words total."]].map(([t, d]) => (
          <div key={t} className="rounded-lg border border-stone-200 bg-stone-50 p-3"><p className="font-bold">{t}</p><p className="text-stone-600">{d}</p></div>))}
      </div>
      <p className="rounded-lg bg-teal-50 p-3 text-sm"><strong>Timing:</strong> 0–3 min: underline key words, pick 2 overview points, group data. 3–17 min: write. 17–20 min: check tense, articles, word count, repeated words.</p>
    </div>
  );
  if (id === "L3") return (
    <div className="space-y-3 text-[15px] leading-relaxed">
      <h4 className="font-serif text-lg font-bold">Paraphrasing formula</h4>
      <p>Prompt: <em>“The line graph shows coffee consumption in the UK and France from 1990 to 2020.”</em></p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        <li>shows → <strong>compares / illustrates / gives information about</strong></li>
        <li>coffee consumption → <strong>the amount of coffee consumed</strong></li>
        <li>in the UK and France → <strong>in two European countries, namely the UK and France</strong></li>
        <li>from 1990 to 2020 → <strong>between 1990 and 2020 / over a 30-year period</strong></li>
      </ul>
      <p className="rounded bg-stone-100 p-2.5 text-sm">✓ Model: “The line graph compares the amount of coffee consumed per person in the UK and France between 1990 and 2020.”</p>
      <h4 className="font-serif text-lg font-bold">Overview: no numbers, only direction</h4>
      <p>Ask: (1) What is highest/lowest overall? (2) What rose vs fell / stayed? (3) What changed most? Join with <em>while/whereas</em>.</p>
      <p className="rounded bg-teal-50 p-2.5 text-sm">✓ “Overall, the UK consumed far more coffee than France throughout the period. While British consumption rose sharply, French figures remained relatively stable.” — 2 sentences, 0 numbers, Band 7+.</p>
    </div>
  );
  if (id === "L4") return (
    <div className="space-y-3 text-[15px]">
      <p>Use dynamic language when time changes (line/bar over years). Vary verbs + adverbs + nouns.</p>
      <div className="grid gap-2 md:grid-cols-3 text-sm">
        {[["Rise", "increase, rise, grow, climb, soar, surge\nsharply / dramatically / steadily / slightly"],
          ["Fall", "decrease, decline, fall, drop, plummet, dip\nsharply / gradually / marginally"],
          ["Flat & peak", "remain stable, level off, fluctuate, peak at, overtake, recover"]].map(([t, d]) => (
          <div key={t} className="rounded-lg border p-3"><p className="font-bold">{t}</p><p className="whitespace-pre-line text-stone-600">{d}</p></div>))}
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-3 text-sm">
        <p><strong>Grammar patterns:</strong> “There was a sharp increase in X (from 2 to 5 kg).” / “X increased sharply to 5 kg, overtaking Y.” / Past tense for past years; present for “shows/illustrates”; future with “is projected to”.</p>
        <p className="mt-1 text-stone-500">✗ “UK up very much.” → ✓ “Consumption in the UK rose dramatically from 2.1 kg to 5.2 kg.”</p>
      </div>
      <LineChartVisual />
    </div>
  );
  if (id === "L5") return (
    <div className="space-y-3 text-[15px]">
      <p>Static charts (pie, table, single-year bar) have no time → <strong>no trend verbs</strong>. Compare with superlatives, fractions, and “while/whereas”.</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        <li>Rank: “Australia recorded the highest figure, at 28 per 1,000, more than double the US figure.”</li>
        <li>Fractions: “just over a third / nearly half / a small minority”.</li>
        <li>Approximation: “around / approximately / roughly / just under”.</li>
        <li>Compare: “In contrast / By comparison / whereas / while”.</li>
      </ul>
      <BarChartVisual /><div className="mt-3"><PieTableVisual /></div>
      <p className="rounded bg-amber-50 p-2.5 text-sm"><strong>Grouping rule:</strong> never describe left-to-right. Group by similarity: highest two together, lowest two together, or “English-speaking vs others”.</p>
    </div>
  );
  return (
    <div className="space-y-3 text-[15px]">
      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-lg border p-3"><p className="font-bold flex items-center gap-1"><GitBranch className="h-4 w-4" /> Process (passive + sequence)</p>
          <p className="mt-1 text-sm text-stone-600">Present passive: “is heated / are packed”. Sequence: “Firstly… Subsequently… Finally…”. Overview = number of stages + start/end: “Overall, there are eight stages, beginning with… and ending with…”</p></div>
        <div className="rounded-lg border p-3"><p className="font-bold flex items-center gap-1"><MapIcon className="h-4 w-4" /> Maps (location + change)</p>
          <p className="mt-1 text-sm text-stone-600">No overview with trends — describe biggest changes. Language: “to the north of / adjacent to / was demolished / was replaced by / was expanded”. Use past for past maps, passive for construction.</p></div>
      </div>
      <div className="rounded-lg bg-stone-100 p-3 text-sm"><p className="font-bold">Brick manufacturing (8 stages) — overview model:</p><p>“Overall, brick production involves eight stages, starting with clay extraction and ending with delivery. While the first four stages prepare raw materials, the latter half centres on shaping, drying and firing.”</p></div>
      <p className="text-sm">Maps model overview: “Overall, the village was transformed from a rural settlement into a residential suburb, with new roads and housing replacing farmland, while the river remained unchanged.”</p>
    </div>
  );
}

// ================= VOCAB =================
function VocabView() {
  const groups = [
    { t: "Introduction paraphrase", items: ["The chart compares…", "The graph illustrates…", "The table gives information about…", "…between… and… / over a …-year period", "…in terms of… / with regard to…"] },
    { t: "Overview starters", items: ["Overall,…", "It is clear that…", "While X…, Y…", "…remained the highest/lowest throughout…", "…saw the most dramatic change…"] },
    { t: "Trend verbs + nouns", items: ["rise / increase / climb / soar ↔ fall / decline / drop / plummet", "a sharp/steady/slight rise in…", "to peak at… / to fluctuate around…", "to overtake / to recover / to level off"] },
    { t: "Comparison & approximation", items: ["the highest / the lowest / ranked second", "more than double / nearly half / just over a third", "around / approximately / roughly (≈)", "In contrast, / By comparison, / whereas"] },
    { t: "Process & maps", items: ["Firstly, … is dug / heated / filtered", "Subsequently / Following this, …", "Finally, … are packaged / delivered", "was demolished / replaced by / converted into", "to the north/south/east/west of…"] },
    { t: "Cohesion (use sparingly)", items: ["Regarding… / With respect to…", "In terms of X, …", "Similarly, … / Likewise, …", "After… / Before… / During…"] },
  ];
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold">Vocabulary bank — copy these frames</h2>
      <p className="mt-1 text-sm text-stone-500">Learn frames, not single words. Swap the underlined data each time.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {groups.map(g => (
          <Card key={g.t} className="border-stone-200"><CardHeader><CardTitle className="text-base">{g.t}</CardTitle></CardHeader>
            <CardContent><ul className="space-y-1.5 text-sm">{g.items.map(i => <li key={i} className="rounded bg-stone-50 px-2 py-1.5">• {i}</li>)}</ul></CardContent></Card>
        ))}
      </div>
    </div>
  );
}

// ================= EXERCISES =================
type MCQ = { q: string; options: string[]; answer: number; explain: string };

const EX_PARAPHRASE: MCQ[] = [
  { q: "Best paraphrase of 'The bar chart shows the number of tourists visiting three cities in 2019.'", options: ["The bar chart shows tourists visiting three cities in 2019.", "The bar chart compares visitor numbers in three cities in 2019.", "Tourists are shown visiting cities and it is a bar chart."], answer: 1, explain: "Change shows→compares and number of tourists→visitor numbers. Option A copies; C is ungrammatical." },
  { q: "'Expenditure on food' can be paraphrased as…", options: ["money spent on food", "expensive food", "food expenditure is big"], answer: 0, explain: "'Money spent on…' is the natural noun→verb paraphrase." },
  { q: "Which introduction avoids copying?", options: ["The pie charts show the proportion of energy from different sources in 2020.", "The pie charts illustrate how energy consumption was divided by source in 2020.", "The pie charts show the proportion, and I will describe them."], answer: 1, explain: "show→illustrate, proportion→how…was divided. Never add 'I will describe'." },
  { q: "'From 2000 to 2010' →", options: ["between 2000 and 2010 / over a ten-year period", "since 2000 to 2010 years ago", "in 2000, 2010"], answer: 0, explain: "Use between…and… or over a ten-year period." },
];
const EX_OVERVIEW: MCQ[] = [
  { q: "UK coffee 2.1→5.2 kg, France 1.8→2.6 kg. Best overview?", options: ["In 1990 the UK drank 2.1 kg and France drank 1.8 kg, then in 2000…", "Overall, the UK consumed far more coffee than France throughout the period. While British consumption rose sharply, French intake remained stable.", "Coffee went up because people like cafes."], answer: 1, explain: "Overview = no numbers, 2 patterns, no reasons. A lists data (belongs in details); C gives opinion." },
  { q: "Which sentence does NOT belong in an overview?", options: ["Overall, coal was the largest source.", "The figure for gas stood at 38% in 2020.", "It is clear that renewable use increased most."], answer: 1, explain: "Specific figures (38%) belong in detail paragraphs, not the overview." },
  { q: "Pick the Band 7 overview pair:", options: ["Overall, A was highest. B was lowest.", "Overall, migration was highest in Australia, at nearly double the UK level, while the USA recorded the lowest figure."], answer: 1, explain: "Second adds comparison ('nearly double') without numbers overload. First is too mechanical." },
];
const EX_TREND: MCQ[] = [
  { q: "2.1 kg → 5.2 kg in 30 years. Best verb?", options: ["plummeted", "soared / surged", "fluctuated"], answer: 1, explain: "More than doubled = soared/surged. Plummeted = fell sharply." },
  { q: "Stays 71% → 72% → 71%. Best phrase?", options: ["remained stable at around 71%", "increased dramatically", "was demolished"], answer: 0, explain: "Tiny moves = remained stable. Dramatically needs a big change." },
  { q: "Choose the accurate sentence:", options: ["There was a slight fall from 98% to 34%.", "There was a dramatic fall from 98% to 34%.", "There was a stable plummet."], answer: 1, explain: "64-point drop = dramatic. 'Stable plummet' contradicts itself." },
  { q: "Passive for process: bricks…", options: ["Bricks are fired in a kiln at 1000°C.", "Bricks fire in a kiln yesterday.", "Bricks will fired soon."], answer: 0, explain: "Present passive: are + past participle. Process uses present, not past." },
];

function QuizBlock({ id, title, items, onDone }: { id: string; title: string; items: MCQ[]; onDone: (key: string, score: number) => void }) {
  const [sel, setSel] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = useMemo(() => {
    let c = 0; items.forEach((m, i) => { if (sel[i] === m.answer) c++; });
    return Math.round((c / items.length) * 100);
  }, [sel, items]);
  return (
    <Card className="border-stone-200">
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle><CardDescription>{items.length} questions · instant marking</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {items.map((m, i) => (
          <div key={i} className={cn("rounded-lg border p-3", checked && sel[i] === m.answer ? "border-teal-600 bg-teal-50" : checked && sel[i] !== undefined ? "border-red-300 bg-red-50" : "border-stone-200")}>
            <p className="text-sm font-semibold">{i + 1}. {m.q}</p>
            <div className="mt-2 space-y-1.5">
              {m.options.map((o, j) => (
                <button key={j} onClick={() => !checked && setSel(prev => ({ ...prev, [i]: j }))}
                  className={cn("block w-full rounded-md border px-2.5 py-1.5 text-left text-sm",
                    sel[i] === j ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white hover:border-stone-400")}>{o}</button>
              ))}
            </div>
            {checked && (
              <p className="mt-2 flex items-start gap-1.5 text-[13px]">
                {sel[i] === m.answer ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
                <span>{sel[i] === m.answer ? "Correct. " : `Incorrect (answer: ${m.options[m.answer]}). `}{m.explain}</span>
              </p>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2">
          {!checked
            ? <Button disabled={Object.keys(sel).length < items.length} onClick={() => { setChecked(true); onDone(id, score); }} className="bg-stone-900">Check answers</Button>
            : <><Badge className={score >= 75 ? "bg-teal-700" : "bg-amber-600"}>Score: {score}%</Badge>
              <Button variant="outline" size="sm" onClick={() => { setSel({}); setChecked(false); }}><RotateCcw className="mr-1 h-3.5 w-3.5" /> Retry</Button></>}
        </div>
      </CardContent>
    </Card>
  );
}

function ExercisesView({ save, best }: { save: (k: string, s: number) => void; best: Record<string, number> }) {
  return (
    <div className="space-y-4">
      <div><h2 className="font-serif text-2xl font-bold">Exercises — test each sub-skill</h2>
        <p className="text-sm text-stone-500">Do all four. Aim for 75%+ before the mock. Best scores save automatically.</p>
        {Object.keys(best).length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{Object.entries(best).map(([k, v]) => <Badge key={k} variant="secondary">{k}: {v}%</Badge>)}</div>}</div>
      <Tabs defaultValue="p1">
        <TabsList className="flex-wrap"><TabsTrigger value="p1">Paraphrase</TabsTrigger><TabsTrigger value="p2">Overview</TabsTrigger><TabsTrigger value="p3">Trend & grammar</TabsTrigger></TabsList>
        <TabsContent value="p1"><QuizBlock id="Paraphrase" title="Drill 1 · Paraphrasing introductions" items={EX_PARAPHRASE} onDone={save} /></TabsContent>
        <TabsContent value="p2"><QuizBlock id="Overview" title="Drill 2 · Spotting a real overview" items={EX_OVERVIEW} onDone={save} /></TabsContent>
        <TabsContent value="p3"><QuizBlock id="Trend" title="Drill 3 · Trend verbs & process passive" items={EX_TREND} onDone={save} /></TabsContent>
      </Tabs>
      <Card className="border-stone-200"><CardHeader><CardTitle className="text-base flex items-center gap-2"><PieChart className="h-4 w-4" /> Drill 4 · Grouping data (do on paper, then reveal)</CardTitle></CardHeader>
        <CardContent className="text-sm"><BarChartVisual /><Reveal label="Show grouping answer"><p className="mt-2 rounded bg-stone-100 p-2.5">Group 1 (highest): Australia + UK — both English-speaking, well above others. Group 2: Canada + USA — lower. Detail 1 = group 1 with figures (28 vs 19); Detail 2 = group 2 (15 vs 11). Never write 4 separate one-country paragraphs.</p></Reveal></CardContent></Card>
    </div>
  );
}

function Reveal({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div><Button variant="outline" size="sm" onClick={() => setOpen(!open)}>{open ? <><EyeOff className="mr-1 h-3.5 w-3.5" /> Hide</> : <><Eye className="mr-1 h-3.5 w-3.5" /> {label}</>}</Button>{open && <div>{children}</div>}</div>;
}

// ================= GUIDED =================
const GUIDED_STEPS = [
  { t: "Step 1 · Introduction (2 min)", hint: "Paraphrase: line graph → compares; coffee consumption → amount of coffee consumed per person; in UK and France → in two European countries. Keep years.", starter: "The line graph compares ", model: "The line graph compares the amount of coffee consumed per person in the UK and France between 1990 and 2020." },
  { t: "Step 2 · Overview (3 min)", hint: "Two patterns, zero numbers: (1) UK always higher, (2) UK rose sharply vs France stable. Start with 'Overall,'.", starter: "Overall, ", model: "Overall, the UK consumed far more coffee than France throughout the period. While British consumption rose sharply, French intake remained relatively stable." },
  { t: "Step 3 · Detail 1 — the riser (5 min)", hint: "UK: 2.1 → 3.0 → 4.4 → 5.2. Use: rose steadily, overtook, peaked at. Add one comparison to France.", starter: "In 1990, British consumption stood at 2.1 kg, ", model: "In 1990, British consumption stood at 2.1 kg, slightly above France's 1.8 kg. It then rose steadily, reaching 3.0 kg in 2000 and 4.4 kg in 2010, before peaking at 5.2 kg in 2020 — more than double the French figure." },
  { t: "Step 4 · Detail 2 — the stable line (5 min)", hint: "France: 1.8 → 2.2 → 2.5 → 2.6. Use: remained stable, slight increase, consistently lower.", starter: "By contrast, French consumption ", model: "By contrast, French consumption remained comparatively stable, edging up from 1.8 kg to 2.2 kg by 2000 and levelling off at 2.6 kg in 2020, consistently well below the UK level." },
];

function GuidedView({ done, setDone }: { done: boolean; setDone: (b: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [drafts, setDrafts] = useState<string[]>(["", "", "", ""]);
  const [showModel, setShowModel] = useState(false);
  const total = countWords(drafts.join(" "));
  const s = GUIDED_STEPS[step];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div>
        <h2 className="font-serif text-2xl font-bold">Guided practice — coffee consumption</h2>
        <p className="text-sm text-stone-500">Write each paragraph with the starter. Compare with the model, then move on.</p>
        <div className="mt-3"><LineChartVisual /></div>
        <Card className="mt-3 border-stone-200">
          <CardHeader><div className="flex items-center justify-between"><Badge>Step {step + 1} / 4</Badge><span className="text-xs text-stone-500">{total} words total</span></div>
            <CardTitle className="text-lg">{s.t}</CardTitle><CardDescription>Hint: {s.hint}</CardDescription></CardHeader>
          <CardContent>
            <Textarea rows={4} value={drafts[step]} placeholder={s.starter + "…"} onChange={e => { const n = [...drafts]; n[step] = e.target.value; setDrafts(n); }} />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => { const n = [...drafts]; if (!n[step].startsWith(s.starter.trim())) n[step] = s.starter; setDrafts(n); }}>Insert starter</Button>
              <Button variant="outline" size="sm" onClick={() => setShowModel(!showModel)}>{showModel ? "Hide model" : "Show model sentence"}</Button>
            </div>
            {showModel && <p className="mt-2 rounded-md bg-teal-50 p-2.5 text-sm"><strong>Model:</strong> {s.model}</p>}
            <Separator className="my-3" />
            <div className="flex justify-between">
              <Button variant="outline" disabled={step === 0} onClick={() => { setStep(step - 1); setShowModel(false); }}>Back</Button>
              {step < 3 ? <Button onClick={() => { setStep(step + 1); setShowModel(false); }} className="bg-stone-900">Next step</Button>
                : <Button onClick={() => setDone(true)} className="bg-teal-700">Finish guided writing</Button>}
            </div>
          </CardContent>
        </Card>
        {done && (
          <Alert className="mt-3 border-teal-600 bg-teal-50"><AlertTitle className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Full Band 9 model (178 words) — compare yours</AlertTitle>
            <AlertDescription className="mt-1 text-sm leading-relaxed">The line graph compares the amount of coffee consumed per person in the UK and France between 1990 and 2020.<br /><br />Overall, the UK consumed far more coffee than France throughout the period. While British consumption rose sharply, French intake remained relatively stable.<br /><br />In 1990, British consumption stood at 2.1 kg, slightly above France's 1.8 kg. It then rose steadily, reaching 3.0 kg in 2000 and 4.4 kg in 2010, before peaking at 5.2 kg in 2020 — more than double the French figure.<br /><br />By contrast, French consumption remained comparatively stable, edging up from 1.8 kg to 2.2 kg by 2000 and levelling off at 2.6 kg in 2020, consistently well below the UK level.</AlertDescription></Alert>
        )}
      </div>
      <div className="space-y-3">
        <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Your draft so far</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">{drafts.map((d, i) => (
            <button key={i} onClick={() => setStep(i)} className={cn("block w-full rounded-md border p-2 text-left", i === step ? "border-stone-900" : "border-stone-200")}>
              <p className="text-xs font-bold text-stone-500">P{i + 1}</p><p className="line-clamp-2 text-stone-700">{d || <span className="italic text-stone-400">empty — click to write</span>}</p>
            </button>))}<p className="text-xs text-stone-500">Target: 160–190 words. Under 150 = penalty.</p></CardContent></Card>
        <Card className="border-amber-200 bg-amber-50"><CardHeader><CardTitle className="text-base">Checklist before finishing</CardTitle></CardHeader>
          <CardContent><CheckList items={["Paraphrased introduction (no copy)?", "Overview has 2 patterns, no numbers?", "Each detail has figures + comparison?", "Past tense for past years?", "150+ words, 4 paragraphs?"]} /></CardContent></Card>
      </div>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  const [c, setC] = useState<boolean[]>(items.map(() => false));
  return <ul className="space-y-1.5 text-sm">{items.map((t, i) => (
    <li key={i}><label className="flex cursor-pointer items-start gap-2 rounded bg-white p-1.5"><input type="checkbox" checked={c[i]} onChange={() => { const n = [...c]; n[i] = !n[i]; setC(n); }} className="mt-1" /><span className={c[i] ? "line-through text-stone-400" : ""}>{t}</span></label></li>))}</ul>;
}

// ================= MOCK =================
function MockView() {
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(20 * 60);
  const [text, setText] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({ TA: 0, CC: 0, LR: 0, GRA: 0 });
  const words = countWords(text);

  useEffect(() => {
    if (!running) return;
    if (secs <= 0) { setRunning(false); return; }
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, secs]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const avg = (Object.values(scores).reduce((a, b) => a + b, 0) / 4).toFixed(1);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h2 className="font-serif text-2xl font-bold">Mock exam — real conditions</h2>
          <p className="text-sm text-stone-500">Write at least 150 words in 20 minutes. No dictionary. Then self-mark.</p></div>
        <Card className={cn("border px-4 py-2", secs < 300 ? "border-red-400 bg-red-50" : "border-stone-200 bg-white")}>
          <p className="flex items-center gap-2 font-mono text-2xl font-bold"><Clock className="h-5 w-5" /> {mm}:{ss}</p>
          <div className="mt-1 flex gap-1.5">
            {!running
              ? <Button size="sm" onClick={() => { setRunning(true); if (secs <= 0) setSecs(1200); }} className="bg-teal-700">Start</Button>
              : <Button size="sm" variant="outline" onClick={() => setRunning(false)}>Pause</Button>}
            <Button size="sm" variant="outline" onClick={() => { setRunning(false); setSecs(1200); }}>Reset</Button>
          </div>
        </Card>
      </div>

      <Card className="mt-3 border-stone-200"><CardHeader><CardTitle className="text-base">Task prompt</CardTitle>
        <CardDescription>You should spend about 20 minutes on this task.</CardDescription></CardHeader>
        <CardContent>
          <p className="rounded-md bg-stone-100 p-3 text-[15px]"><strong>The bar chart below shows net migration per 1,000 people in four countries in 2023.</strong> Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.</p>
          <div className="mt-3"><BarChartVisual /></div>
        </CardContent></Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card className="border-stone-200"><CardHeader>
          <div className="flex items-center justify-between"><CardTitle className="text-base">Your answer</CardTitle>
            <span className={cn("rounded px-2 py-0.5 text-xs font-bold", words < 150 ? "bg-red-100 text-red-700" : "bg-teal-100 text-teal-800")}>{words} words {words < 150 ? `(need ${150 - words} more)` : "✓"}</span></div></CardHeader>
          <CardContent><Textarea rows={16} value={text} onChange={e => setText(e.target.value)} placeholder="The bar chart compares…&#10;&#10;Overall,…" className="font-serif text-[15px] leading-relaxed" />
            <div className="mt-2 flex gap-2"><Button variant="outline" size="sm" onClick={() => { setText(""); }}>Clear</Button>
              <Button variant="outline" size="sm" onClick={() => setShowModel(!showModel)}>{showModel ? "Hide model" : "Reveal Band 9 model + self-mark"}</Button></div></CardContent></Card>

        <div className="space-y-3">
          {!showModel ? (
            <Card className="border-dashed"><CardContent className="py-10 text-center text-sm text-stone-500">Finish writing (or when the timer hits 0:00), then reveal the model answer and mark yourself against the four criteria. Be strict — examiners are.</CardContent></Card>
          ) : (
            <>
              <Card className="border-teal-600"><CardHeader><CardTitle className="text-base">Band 9 model (172 words)</CardTitle></CardHeader>
                <CardContent className="text-sm leading-relaxed">The bar chart compares net migration rates in four countries — Australia, the UK, Canada and the USA — in 2023.<br /><br />Overall, Australia recorded by far the highest rate, at nearly double the next-highest figure, while the USA had the lowest. English-speaking destinations outside the US attracted considerably more migrants per capita.<br /><br />Australia led with 28 arrivals per 1,000 people, substantially above the UK's 19. Canada followed with 15, around half the Australian level but still markedly higher than the USA.<br /><br />By contrast, the USA recorded only 11 per 1,000, the lowest of the four. This is roughly two-fifths of the Australian figure and about three-quarters of the Canadian rate, indicating a notably smaller migratory inflow relative to population.</CardContent></Card>
              <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Self-marking rubric — drag to your level</CardTitle><CardDescription>5.0 → 9.0. Average = your estimate.</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                  {[["TA", "Overview present? Key features + figures? 150+ words? No opinion?"], ["CC", "4 paragraphs? Logical groups? Varied linkers (Overall, By contrast…)?"], ["LR", "No repeated 'big/high'? Approximation (around, nearly)? Comparison?"], ["GRA", "Correct tense? Complex sentences (while/which)? Articles?"]].map(([k, d]) => (
                    <div key={k}><div className="flex justify-between text-sm"><span><strong>{k}</strong> <span className="text-stone-500">— {d}</span></span><Badge variant="secondary">{scores[k].toFixed(1)}</Badge></div>
                      <input type="range" min={5} max={9} step={0.5} value={scores[k]} onChange={e => setScores(prev => ({ ...prev, [k]: Number(e.target.value) }))} className="w-full accent-teal-700" /></div>))}
                  <Separator />
                  <p className="flex items-center gap-2 font-serif text-xl font-bold"><Award className="h-5 w-5 text-amber-600" /> Estimated band: {avg}</p>
                  <Accordion type="single" collapsible><AccordionItem value="fix"><AccordionTrigger className="text-sm">What to fix for +0.5?</AccordionTrigger>
                    <AccordionContent className="text-sm"><ul className="list-disc pl-5 space-y-1"><li>TA below 7: add/fix overview (2 patterns, no numbers) and hit 150 words.</li><li>CC below 7: regroup — highest two vs lowest two, not country-by-country.</li><li>LR below 7: replace every 'very big' with 'substantially / considerably / markedly' + approximation.</li><li>GRA below 7: check every past-year verb is past tense; add one 'while/whereas' complex sentence.</li></ul></AccordionContent></AccordionItem></Accordion>
                </CardContent></Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
