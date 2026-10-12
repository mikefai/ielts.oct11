import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Heading, ScanSearch, CheckCircle2, XCircle,
  Clock, RotateCcw, Award, ChevronRight, BookOpen, ListChecks
} from "lucide-react";
import { cn } from "@/lib/utils";

export type RSection = "rhome" | "rtypes" | "rheadings" | "rex" | "rguided" | "rmock";

type MCQ = { q: string; options: string[]; answer: number; explain: string };

function RQuiz({ id, title, items, onDone }: { id: string; title: string; items: MCQ[]; onDone: (key: string, score: number) => void }) {
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
                <span>{sel[i] === m.answer ? "Correct. " : `Incorrect — answer: ${m.options[m.answer]}. `}{m.explain}</span>
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

// ================= READING HOME =================
export function ReadingHome({ go, goWriting, scores }: { go: (s: RSection) => void; goWriting: (s: "home") => void; scores: Record<string, number> }) {
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-stone-200">
          <CardHeader>
            <Badge className="w-fit bg-teal-700">Academic Reading · 60 mins · 40 questions · 3 passages</Badge>
            <CardTitle className="mt-2 font-serif text-3xl leading-tight">Find answers.<br />Don't read everything.</CardTitle>
            <CardDescription className="text-base">Reading is a search test, not a comprehension test. Every question here trains one move: skim for structure, scan for detail, match paraphrase — then move on.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[["60", "minutes total"], ["40", "questions"], ["20 min", "max per passage"]].map(([a, b]) => (
                <div key={a} className="rounded-md bg-stone-100 p-2"><p className="font-serif text-xl font-bold">{a}</p><p className="text-stone-600">{b}</p></div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => go("rtypes")} className="bg-stone-900 hover:bg-stone-800">Learn question types <ChevronRight className="ml-1 h-4 w-4" /></Button>
              <Button variant="outline" onClick={() => go("rheadings")}>Match Headings lab</Button>
            </div>
            {Object.keys(scores).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">{Object.entries(scores).map(([k, v]) => <Badge key={k} variant="secondary">{k}: {v}%</Badge>)}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader><CardTitle className="font-serif text-xl">The 3-passage battle plan</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[["Passage 1 (easiest) — 15 min", "Factual, concrete. Do first for confidence. Mostly completion + T/F/NG."],
              ["Passage 2 — 18 min", "Workplace/educational topics. Matching + multiple choice appear here."],
              ["Passage 3 — 22 min", "Abstract, argumentative. Headings + Yes/No/NG live here. Hardest — leave last."],
              ["Transfer answers as you go", "Computer test: no extra transfer time. Paper: answers must be on the sheet at 60:00."]].map(([t, d]) => (
              <div key={t} className="rounded-md border border-amber-200 bg-white p-2.5"><p className="font-bold">{t}</p><p className="text-stone-600">{d}</p></div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { id: "rtypes" as RSection, t: "All 10 question types", d: "What each type asks, exact method, traps, and time per question.", c: "Study the types" },
          { id: "rheadings" as RSection, t: "Match Headings lab", d: "The most-feared type, deconstructed: 6-step method + 2 full drills.", c: "Master headings" },
          { id: "rex" as RSection, t: "Exercises", d: "T/F/NG, Y/N/NG, endings, summary, features — all auto-marked.", c: "Do drills" },
          { id: "rmock" as RSection, t: "Mock test", d: "One full passage, 13 questions, 20:00 timer, answer key + band scale.", c: "Start mock" },
        ].map(c => (
          <Card key={c.id} className="flex flex-col border-stone-200">
            <CardHeader><CardTitle className="font-serif text-lg">{c.t}</CardTitle><CardDescription>{c.d}</CardDescription></CardHeader>
            <CardContent className="mt-auto"><Button variant="outline" className="w-full" onClick={() => go(c.id)}>{c.c}</Button></CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-4 border-stone-200">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
          <p className="text-sm text-stone-600">Writing Task 1 still to do? Charts use the same skimming brain — overview first, detail second.</p>
          <Button variant="outline" onClick={() => goWriting("home")}><BookOpen className="mr-1 h-4 w-4" /> Back to Writing</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ================= ALL QUESTION TYPES =================
const RTYPES: { n: string; tag: string; what: string; method: string[]; trap: string }[] = [
  { n: "1 · Multiple Choice", tag: "4 options, 1 answer", what: "Pick A–D. Tests gist or detail; options are heavily paraphrased.", method: ["Read the stem first, not the options (options prime you wrong).", "Predict the answer type: number? reason? attitude?", "Eliminate 2 obviously wrong, then compare the last 2 against the text word by word."], trap: "The option that repeats passage words is usually the trap — correct answers paraphrase." },
  { n: "2 · True / False / NOT GIVEN", tag: "facts in the text", what: "Is the statement's FACT supported, contradicted, or absent? Only about what is written.", method: ["Underline numbers, names, absolutes (all, never, only) in the statement.", "FALSE needs a direct contradiction (dates, figures, direction).", "If you cannot find it after scanning 2 paragraphs, answer NOT GIVEN and move on."], trap: "Opinions and reasons feel 'false' but are NOT GIVEN — nothing in the text confirms or denies them." },
  { n: "3 · Yes / No / NOT GIVEN", tag: "author's views", what: "Same mechanics as T/F/NG but asks about CLAIMS and OPINIONS, not facts.", method: ["Look for opinion signals: argue, claim, believe, suggest, criticise.", "YES = the author actually states this view. NO = the author states the opposite.", "Ask: 'whose view?' — a quoted researcher's view is not the author's."], trap: "Mixing up T/F with Y/N. The question wording tells you: 'Do the statements agree with the views of the writer?'" },
  { n: "4 · Matching Headings", tag: "most feared", what: "Match each paragraph to its main-idea heading. Always more headings than paragraphs.", method: ["Read all headings first; underline 2 keywords in each.", "Read first 2 + last 1 sentences of each paragraph — the topic lives there.", "Match easy paragraphs first, cross headings off, solve hard ones by elimination."], trap: "Word-matching: a heading sharing 3 words with a paragraph is usually a distractor. Headings summarise, details don't." },
  { n: "5 · Matching Information", tag: "which paragraph contains…", what: "Find where a detail (a number, example, definition, reason) appears. NOT in order; one paragraph can hold two answers.", method: ["Turn each item into a search word: the rarest noun or number.", "Scan for that word or its synonym; read only that sentence.", "Same paragraph can answer twice — don't rule it out."], trap: "Two paragraphs may mention the topic; only one contains the exact detail asked for." },
  { n: "6 · Matching Features", tag: "names → findings", what: "Match people, dates, or theories (List A) to statements (List B): who discovered X? which theory says Y?", method: ["Scan for capitalised names first — they are visible anchors.", "Read 2 sentences around each name; the finding sits beside it.", "Options may be reused ('may be used more than once') — check instructions."], trap: "A name mentioned twice: the finding belongs to the sentence where the claim is made, not the first mention." },
  { n: "7 · Matching Sentence Endings", tag: "grammar helps", what: "Complete sentence beginnings with the correct endings from a box.", method: ["Read beginnings, predict ending type (cause? result? contrast?).", "Use grammar: singular/plural, verb forms narrow options fast.", "Confirm by locating the paraphrased sentence in the text."], trap: "Two endings fit grammatically — only one matches the text's meaning." },
  { n: "8 · Sentence Completion", tag: "word limit!", what: "Finish sentences using words from the passage. Instructions like 'NO MORE THAN TWO WORDS' are law.", method: ["Note the word limit before reading anything.", "Predict word type: noun? number? adjective?", "Copy spelling exactly; hyphenated words count as one."], trap: "Writing three words when two are allowed scores zero even if the meaning is right." },
  { n: "9 · Summary / Note / Table / Flow-chart Completion", tag: "follow the shape", what: "Fill gaps in a summary of all or part of the passage. May use a word bank or 'words from the text'.", method: ["Read the summary first — its order follows the passage.", "Use surrounding words to predict each gap's word class.", "With a bank: cross off used words; without: scan for the anchor sentence."], trap: "Flow-charts test SEQUENCE — a correct word in the wrong stage is wrong." },
  { n: "10 · Short-Answer Questions", tag: "few words", what: "'Answer in NO MORE THAN THREE WORDS AND/OR A NUMBER.' Questions follow passage order.", method: ["Underline the wh-word: who/what/when/how many — it tells you the target.", "Questions run in order: Q1's answer sits above Q2's.", "Never write full sentences; extra words can break the limit."], trap: "Articles (a/the) and numbers don't count? They DO count — keep it minimal." },
  { n: "11 · Diagram / Map Labelling", tag: "visual anchor", what: "Label parts of a diagram using passage words. The picture shows you where to look.", method: ["Study the diagram first; predict each label's type (material? stage?).", "Scan the passage for the labelled neighbour parts.", "Descriptions run in order around the diagram."], trap: "Labels need exact passage spelling — 'steel pipe' vs 'steel pipes' matters." },
];

export function ReadingTypesView() {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold">All 11 Academic Reading question types</h2>
      <p className="mt-1 text-sm text-stone-500">Each card: what it asks, the exact method, and the trap that costs marks. Headings get a full lab of their own.</p>
      <Accordion type="single" collapsible className="mt-4 space-y-2">
        {RTYPES.map((t) => (
          <AccordionItem key={t.n} value={t.n} className="rounded-lg border border-stone-200 bg-white px-3">
            <AccordionTrigger className="text-left">
              <span className="flex items-center gap-2"><span className="font-serif font-bold">{t.n}</span><Badge variant="secondary" className="text-[11px]">{t.tag}</Badge></span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm"><strong>What:</strong> {t.what}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{t.method.map((m, i) => <li key={i}>{m}</li>)}</ol>
              <p className="mt-2 rounded-md bg-amber-50 p-2 text-sm"><strong>Trap:</strong> {t.trap}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Alert className="mt-4 border-teal-600 bg-teal-50">
        <AlertTitle>Order strategy that saves 5 minutes</AlertTitle>
        <AlertDescription className="text-sm">Do completion questions (8–11) first — they follow passage order and teach you the text. Then matching sets. Then T/F/NG + Y/N/NG. Headings LAST — by then you know every paragraph.</AlertDescription>
      </Alert>
    </div>
  );
}

// ================= MATCH HEADINGS LAB =================
const NAP_HEADINGS = [
  "i. A cultural shift in attitudes to rest",
  "ii. Evidence from aviation research",
  "iii. Employers embrace daytime sleep",
  "iv. The drawbacks of oversleeping",
  "v. Guidelines for an effective nap",
  "vi. The link between diet and night-time sleep",
  "vii. Sleep patterns in non-industrial societies",
];
const NAP_PARAS = [
  { label: "Paragraph A", text: "For most of the twentieth century, dozing in daylight was treated as a moral failing. Managers equated visible tiredness with laziness, and employees who admitted to napping risked their reputation. Sleep, in the industrial mindset, belonged strictly to the night.", answer: 0, why: "Whole paragraph = old attitude (moral failing, laziness) — heading i summarises this idea. Heading vii mentions 'societies' but the paragraph is about attitudes, not sleep patterns." },
  { label: "Paragraph B", text: "The turning point came from an unlikely source: the cockpit. In a NASA study, pilots allowed a 26-minute nap showed a 34% improvement in performance and a 54% rise in alertness. The effect was so large that aviation regulators began mandating rest breaks on long-haul flights.", answer: 1, why: "The paragraph's point is the NASA/pilot study — heading ii. 'Performance' appears but heading iv (drawbacks) is wrong: this paragraph is positive evidence." },
  { label: "Paragraph C", text: "Businesses were quick to commercialise the findings. Technology firms installed silent pods, and some factories now schedule a twenty-minute 'recharge break' after lunch. Firms report fewer afternoon errors, though few publish hard data.", answer: 2, why: "Topic = what employers do now (pods, scheduled breaks) — heading iii. Note 'afternoon errors' is a detail, not the main idea." },
  { label: "Paragraph D", text: "Longer naps, however, carry a cost. Sleeping beyond thirty minutes pushes the brain into deep sleep, and waking from it produces grogginess, impaired memory and worse performance than before — a state researchers call sleep inertia.", answer: 3, why: "Main idea = the cost of long naps — heading iv. 'Thirty minutes' also appears in napping advice, but this paragraph is about harm, not guidelines." },
  { label: "Paragraph E", text: "Specialists therefore recommend keeping naps short and early: ten to twenty minutes, before 3 p.m., in a dark, cool room, followed by exposure to daylight. Caffeine just before lying down can even sharpen the wake-up, they add.", answer: 4, why: "A list of recommendations = guidelines — heading v. It mentions 'thirty minutes'-type detail too, but the paragraph's function is advice." },
];

const TRAP_QUIZ: MCQ[] = [
  { q: "A heading shares three exact words with a paragraph but describes only its final example. You should…", options: ["choose it — word match means correct", "reject it — headings summarise the whole paragraph, not one detail", "choose it if you are short on time"], answer: 1, explain: "Classic distractor design. The test writers plant shared vocabulary in wrong headings on purpose." },
  { q: "Two headings both seem to fit paragraph C. Best move?", options: ["Pick the first one and move on", "Match all easy paragraphs first, cross headings off, return with fewer options", "Always pick the longer heading"], answer: 1, explain: "Elimination is the core headings skill. Easy-first shrinks the choice set for hard paragraphs." },
  { q: "Where is a paragraph's main idea MOST often found?", options: ["In the middle sentence", "In the first 1–2 sentences and the last sentence", "Spread evenly — every sentence matters equally"], answer: 1, explain: "Academic paragraphs are topic-sentence led. Skim first two + last one before deciding." },
  { q: "'The link between diet and night-time sleep' (heading vi) vs a paragraph mentioning 'lunch breaks'. This heading is…", options: ["correct — lunch is diet", "a distractor — lunch break ≠ diet research; topic mismatch", "correct if no better heading exists"], answer: 1, explain: "'Lunch' here means timing of the break, not nutrition. Distractors exploit loose word association." },
];

function HeadingsMatchDrill({ onDone }: { onDone: (key: string, score: number) => void }) {
  const [sel, setSel] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = useMemo(() => {
    let c = 0; NAP_PARAS.forEach((p, i) => { if (sel[i] === p.answer) c++; });
    return Math.round((c / NAP_PARAS.length) * 100);
  }, [sel]);
  return (
    <Card className="border-stone-200">
      <CardHeader><CardTitle className="text-lg">Drill A · Match the 5 paragraphs</CardTitle>
        <CardDescription>Passage: "The Power of Napping". Two headings are distractors and must be left unused.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md bg-stone-100 p-2.5 text-sm"><strong>Heading bank:</strong><ul className="mt-1 space-y-0.5">{NAP_HEADINGS.map(h => <li key={h}>{h}</li>)}</ul></div>
        {NAP_PARAS.map((p, i) => (
          <div key={i} className={cn("rounded-lg border p-3", checked && sel[i] === p.answer ? "border-teal-600 bg-teal-50" : checked ? "border-red-300 bg-red-50" : "border-stone-200")}>
            <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{p.label}</p>
            <p className="mt-1 text-sm leading-relaxed">{p.text}</p>
            <select value={sel[i] ?? ""} disabled={checked} onChange={e => setSel(prev => ({ ...prev, [i]: Number(e.target.value) }))}
              className="mt-2 w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm">
              <option value="">— choose a heading —</option>
              {NAP_HEADINGS.map((h, j) => <option key={h} value={j}>{h}</option>)}
            </select>
            {checked && <p className="mt-2 flex items-start gap-1.5 text-[13px]">
              {sel[i] === p.answer ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
              <span><strong>Answer: {NAP_HEADINGS[p.answer]}.</strong> {p.why}</span></p>}
          </div>
        ))}
        <div className="flex items-center gap-2">
          {!checked
            ? <Button disabled={Object.keys(sel).length < NAP_PARAS.length} onClick={() => { setChecked(true); onDone("Headings drill", score); }} className="bg-stone-900">Check headings</Button>
            : <><Badge className={score >= 80 ? "bg-teal-700" : "bg-amber-600"}>{score}% ({NAP_PARAS.filter((p, i) => sel[i] === p.answer).length}/5)</Badge>
              <Button variant="outline" size="sm" onClick={() => { setSel({}); setChecked(false); }}><RotateCcw className="mr-1 h-3.5 w-3.5" /> Retry</Button></>}
        </div>
      </CardContent>
    </Card>
  );
}

export function HeadingsLab() {
  const [done, setDone] = useState<Record<string, number>>({});
  const save = (k: string, s: number) => setDone(d => ({ ...d, [k]: Math.max(d[k] ?? 0, s) }));
  return (
    <div className="space-y-4">
      <div><h2 className="font-serif text-2xl font-bold">Match Headings lab — the 6-step method</h2>
        <p className="text-sm text-stone-500">Headings test one thing: can you tell a main idea from a detail? Drill it here, then it stops being scary.</p></div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {[["1 · Read headings first", "Underline 2 keywords per heading. Predict what each would look like. 2 minutes max."],
          ["2 · Skim, don't read", "First 2 sentences + last 1 of each paragraph. The topic sentence carries ~80% of the answer."],
          ["3 · Match easy first", "Obvious pairs first. Cross used headings off immediately — like Sudoku."],
          ["4 · Distrust word matches", "Shared vocabulary = trap until proven otherwise. Ask: 'whole paragraph or one detail?'"],
          ["5 · Never reuse (usually)", "Instructions say if headings can repeat — normally each is used once, and some are never used."],
          ["6 · Do headings last", "In a real test, finish all other sets first. You'll already know every paragraph."]].map(([t, d]) => (
          <div key={t} className="rounded-lg border border-stone-200 bg-white p-3 text-sm"><p className="font-bold">{t}</p><p className="mt-0.5 text-stone-600">{d}</p></div>
        ))}
      </div>
      <HeadingsMatchDrill onDone={save} />
      <RQuiz id="Heading traps" title="Drill B · Trap recognition (no passage needed)" items={TRAP_QUIZ} onDone={save} />
      {Object.keys(done).length > 0 && <div className="flex flex-wrap gap-1.5">{Object.entries(done).map(([k, v]) => <Badge key={k} variant="secondary">{k}: {v}%</Badge>)}</div>}
      <Alert className="border-amber-300 bg-amber-50"><AlertTitle>Examiner truth</AlertTitle>
        <AlertDescription className="text-sm">Headings are written FIRST by test designers, paragraphs second. Each wrong heading is engineered around one paragraph's detail. If two headings fit, you are reading detail — zoom out and re-read the first sentence.</AlertDescription></Alert>
    </div>
  );
}

// ================= READING EXERCISES =================
const EX_TFNG: MCQ[] = [
  { q: "Passage: 'Desalination plants now supply 12% of the city's water, up from 3% in 2010.' Statement: 'Desalination provides roughly one-eighth of the city's water.'", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: 0, explain: "12% ≈ one-eighth (12.5%). Paraphrased numbers still count as TRUE." },
  { q: "Same passage. Statement: 'Desalination is cheaper than recycling wastewater.'", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: 2, explain: "No cost comparison appears anywhere — classic NOT GIVEN. Don't use outside knowledge." },
  { q: "Passage: 'The mayor opposed the plant until 2018, when drought forced approval.' Statement: 'The mayor has always supported desalination.'", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: 1, explain: "'Opposed until 2018' directly contradicts 'always supported' → FALSE." },
  { q: "Passage: 'All coastal districts receive desalinated water daily.' Statement: 'Some coastal districts receive desalinated water.'", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: 0, explain: "'All receive' logically includes 'some receive' → TRUE. Weaker claims inside stronger ones are TRUE." },
];
const EX_YNNG: MCQ[] = [
  { q: "Author: 'It is often claimed that bees are dying out; the evidence, however, points to redistribution rather than decline.' Statement: 'The writer believes bee decline is overstated.'", options: ["YES", "NO", "NOT GIVEN"], answer: 0, explain: "'Points to redistribution rather than decline' = the author endorses the sceptical view → YES." },
  { q: "When a question asks 'Do the statements agree with the VIEWS of the writer?', you answer…", options: ["True / False / Not Given", "Yes / No / Not Given", "Either — they are identical"], answer: 1, explain: "Views/claims/arguments → Yes/No/NG. Facts from the text → True/False/NG. Using the wrong set scores zero." },
  { q: "Passage quotes Dr Lee: 'Cities are unliveable.' The author calls this 'an exaggeration'. Statement: 'The writer considers cities unliveable.'", options: ["YES", "NO", "NOT GIVEN"], answer: 1, explain: "The quoted view is Lee's, and the author rejects it ('exaggeration') → NO." },
];
const EX_ENDINGS: MCQ[] = [
  { q: "'Green roofs reduce summer cooling costs…' (passage: roofs cut cooling demand by up to 30%)", options: ["…by nearly a third.", "…by tripling energy use.", "…only in winter."], answer: 0, explain: "30% ≈ nearly a third. Grammar fits and the figure matches the text." },
  { q: "'The 2019 survey of 400 firms found that…' (passage: 60% cited maintenance costs as the barrier)", options: ["…most firms feared upkeep expenses.", "…all firms rejected green roofs.", "…firms preferred higher costs."], answer: 0, explain: "60% = most; 'maintenance costs' paraphrased as 'upkeep expenses'. 'All' contradicts 60%." },
  { q: "'Unlike solar panels, green roofs…' (passage: unlike panels, roofs also manage stormwater)", options: ["…help absorb heavy rainfall.", "…generate more electricity.", "…require no installation."], answer: 0, explain: "The contrast point is stormwater. B reuses 'electricity' words from the passage as a trap." },
];
const EX_SUMMARY: MCQ[] = [
  { q: "Summary: 'Patients recovered ___ after ten-minute walks.' Passage: 'Brief walks accelerated recovery significantly.' Bank: [rapidly / slowly / expensively / weekly]", options: ["rapidly", "slowly", "expensively", "weekly"], answer: 0, explain: "'Accelerated…significantly' → 'rapidly'. Grammar (adverb) also eliminates nouns." },
  { q: "Flow-chart: Raw clay → ___ → firing. Passage: 'Clay is first shaped, then dried for 48 hours before firing.'", options: ["shaping", "drying", "cooling", "painting"], answer: 1, explain: "Sequence matters: shaped first, then the step before firing is drying." },
  { q: "Table gap: 'Maximum nap length: ___ minutes.' Passage: 'Naps exceeding thirty minutes risk sleep inertia.'", options: ["thirty", "thirteen", "three hundred", "three"], answer: 0, explain: "Copy the exact figure. 'Thirty' as a word still respects the limit if instructions allow one word." },
];
const EX_FEATURES: MCQ[] = [
  { q: "Dr Allen linked city trees to lower asthma rates. Dr Bhatt linked them to cooler streets. Who found the health effect?", options: ["Dr Allen", "Dr Bhatt", "Both", "Neither"], answer: 0, explain: "Asthma = health → Allen. Scan names, read the adjacent claim." },
  { q: "Which finding belongs to Dr Bhatt?", options: ["Reduced respiratory illness", "Lower street temperatures", "Higher property prices", "Faster traffic flow"], answer: 1, explain: "'Cooler streets' paraphrased as 'lower street temperatures'." },
];

export function ReadingExercises({ save, best }: { save: (k: string, s: number) => void; best: Record<string, number> }) {
  return (
    <div className="space-y-4">
      <div><h2 className="font-serif text-2xl font-bold">Reading exercises — auto-marked drills</h2>
        <p className="text-sm text-stone-500">Headings have their own lab. Here: the other high-frequency types.</p>
        {Object.keys(best).length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{Object.entries(best).map(([k, v]) => <Badge key={k} variant="secondary">{k}: {v}%</Badge>)}</div>}</div>
      <Tabs defaultValue="tfng">
        <TabsList className="flex flex-wrap"><TabsTrigger value="tfng">T/F/NG</TabsTrigger><TabsTrigger value="ynng">Y/N/NG</TabsTrigger><TabsTrigger value="end">Endings</TabsTrigger><TabsTrigger value="sum">Summary gaps</TabsTrigger><TabsTrigger value="feat">Features</TabsTrigger></TabsList>
        <TabsContent value="tfng"><RQuiz id="True/False/NG" title="Drill · True / False / NOT GIVEN" items={EX_TFNG} onDone={save} /></TabsContent>
        <TabsContent value="ynng"><RQuiz id="Yes/No/NG" title="Drill · Yes / No / NOT GIVEN + rules" items={EX_YNNG} onDone={save} /></TabsContent>
        <TabsContent value="end"><RQuiz id="Sentence endings" title="Drill · Matching sentence endings" items={EX_ENDINGS} onDone={save} /></TabsContent>
        <TabsContent value="sum"><RQuiz id="Summary gaps" title="Drill · Summary & flow-chart gaps" items={EX_SUMMARY} onDone={save} /></TabsContent>
        <TabsContent value="feat"><RQuiz id="Features" title="Drill · Matching features (who found what)" items={EX_FEATURES} onDone={save} /></TabsContent>
      </Tabs>
    </div>
  );
}

// ================= GUIDED READING =================
const GParas = [
  { label: "Paragraph A", text: "In the 1990s, city planners treated street trees as decoration — pleasant but expendable when roads needed widening. Hundreds of mature trees were felled each year, and few residents protested.", point: "Old attitude: trees seen as expendable decoration." },
  { label: "Paragraph B", text: "New measurement tools changed the calculation. A 2018 survey across six cities found streets with dense canopies were on average 2.4°C cooler in summer, and households nearby used 18% less energy for cooling.", point: "Evidence: cooler streets + lower energy use (figures)." },
  { label: "Paragraph C", text: "Health researchers added a second argument. Children living within 300 metres of green space showed markedly lower asthma rates, a result replicated in three countries. Critics note that wealthier areas have both more trees and better healthcare, so causation remains debated.", point: "Health claim + the counter-argument (evaluative — classic Yes/No/NG territory)." },
  { label: "Paragraph D", text: "Policy has followed the evidence, unevenly. Some councils now protect every tree above a set trunk size, while others still approve removals for development. The trend, however, is clearly toward preservation.", point: "Mixed current policy, overall direction = preservation." },
];

export function ReadingGuided() {
  const [step, setStep] = useState(0);
  const [showWhy, setShowWhy] = useState(false);
  const steps = [
    { t: "Step 1 · Skim for structure (2 min)", task: "Read ONLY the first sentence of each paragraph above. In your head, answer: what is each paragraph FOR?", why: "A: old view. B: new cooling evidence. C: health evidence + debate. D: policy today. You now own the passage map — most students skip this and drown in detail." },
    { t: "Step 2 · Headings by elimination", task: "Match: A → 'Trees once treated as disposable' · B → 'Measured cooling benefits' · C → 'A contested health claim' · D → 'Uneven but greener policies'. Which was hardest?", why: "C is hardest: two ideas (claim + criticism). The heading must cover BOTH — any heading mentioning only asthma is a detail-trap." },
    { t: "Step 3 · Scan for a number", task: "Without re-reading: how much less cooling energy did shaded households use? (Answer: 18%.) What did you scan for?", why: "You scanned for '%' or 'energy' — rare, visible anchors. Numbers and capitals are the fastest scan targets. Answer sits in paragraph B." },
    { t: "Step 4 · T/F/NG judgment", task: "Statement: 'All scientists agree trees reduce asthma.' True, False or Not Given?", why: "FALSE — paragraph C says causation 'remains debated' and critics disagree. 'All agree' is an absolute the text contradicts. Absolutes (all/never/only) are False-bells." },
  ];
  const s = steps[step];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div>
        <h2 className="font-serif text-2xl font-bold">Guided reading — "City Trees" in 4 moves</h2>
        <p className="text-sm text-stone-500">Read the passage once, then walk the steps. Each step reveals examiner reasoning.</p>
        <Card className="mt-3 border-stone-200"><CardHeader><CardTitle className="text-base flex items-center gap-2"><ScanSearch className="h-4 w-4" /> The passage (read once, ~90 seconds)</CardTitle></CardHeader>
          <CardContent className="space-y-2.5">{GParas.map(p => (
            <div key={p.label} className="rounded-md bg-stone-50 p-2.5 text-sm"><p className="text-xs font-bold uppercase tracking-wide text-stone-500">{p.label}</p><p className="mt-0.5 leading-relaxed">{p.text}</p></div>
          ))}</CardContent></Card>
        <Card className="mt-3 border-stone-200">
          <CardHeader><Badge className="w-fit">Move {step + 1} / 4</Badge><CardTitle className="text-lg">{s.t}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-[15px]">{s.task}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowWhy(!showWhy)}>{showWhy ? "Hide examiner reasoning" : "Reveal examiner reasoning"}</Button>
            {showWhy && <p className="mt-2 rounded-md bg-teal-50 p-2.5 text-sm">{s.why}</p>}
            <Separator className="my-3" />
            <div className="flex justify-between">
              <Button variant="outline" disabled={step === 0} onClick={() => { setStep(step - 1); setShowWhy(false); }}>Back</Button>
              {step < 3 ? <Button className="bg-stone-900" onClick={() => { setStep(step + 1); setShowWhy(false); }}>Next move</Button>
                : <span className="text-sm font-semibold text-teal-700">Done — try the mock under time pressure →</span>}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-3">
        <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Paragraph map (your skim notes)</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">{GParas.map(p => (
            <div key={p.label} className="rounded-md border border-stone-200 p-2"><p className="font-bold">{p.label}</p><p className="text-stone-600">{p.point}</p></div>))}</CardContent></Card>
        <Card className="border-amber-200 bg-amber-50"><CardHeader><CardTitle className="text-base">Golden scanning habits</CardTitle></CardHeader>
          <CardContent className="text-sm"><ul className="list-disc space-y-1 pl-5"><li>Search rare nouns, numbers, capitals — never common verbs.</li><li>Read the question stem first, predict the answer type.</li><li>One scan, one answer — re-scanning the whole text bleeds time.</li></ul></CardContent></Card>
      </div>
    </div>
  );
}

// ================= READING MOCK =================
const MOCK_HEADINGS = [
  "i. Economic arguments for green space",
  "ii. A mistaken belief about city history",
  "iii. Health effects beyond exercise",
  "iv. Cooling the urban heat island",
  "v. Policy shifts toward preservation",
  "vi. Wildlife corridors in suburbs",
  "vii. The chemistry of tree leaves",
];
const MOCK_PARAS = [
  { label: "Paragraph A", text: "Contrary to popular belief, most great cities were never concrete from edge to edge. Nineteenth-century maps of London, Paris and Beijing show orchards, commons and market gardens woven between streets. The treeless city is a twentieth-century invention, born of road-building and a belief that greenery wasted valuable land." },
  { label: "Paragraph B", text: "The physics is now well measured. Vegetation cools through shade and transpiration: a single mature tree can transpire over 400 litres of water on a hot day. Districts with dense canopy cover record summer temperatures up to 3°C lower than bare neighbourhoods nearby." },
  { label: "Paragraph C", text: "The benefits extend beyond temperature. Hospital patients with views of trees require fewer painkillers and leave wards sooner, while office workers near parks report lower stress. Researchers stress these are correlations with plausible mechanisms, not proof of cure." },
  { label: "Paragraph D", text: "Money follows measurement. A landmark valuation estimated that London's trees save the city over £100 million yearly in cooling, flood prevention and air filtration. Developers, once hostile, now advertise proximity to canopy cover as a selling point." },
  { label: "Paragraph E", text: "Regulation is catching up, patchily. Several councils have introduced fines for felling above a trunk threshold, yet exemptions for construction remain wide. Enforcement is thin, but the legal direction is unmistakable: removal is increasingly the exception." },
];
const MOCK_HEAD_ANS = [1, 3, 2, 0, 4];
const MOCK_HEAD_WHY = [
  "A corrects a belief ('contrary to popular belief… treeless city is an invention') — heading ii. History detail, not policy.",
  "B is physics/measurement of cooling (3°C) — heading iv. Money appears nowhere here.",
  "C goes beyond temperature into hospitals/stress — heading iii ('beyond exercise'). Note the caution about proof — evaluative detail.",
  "D values trees in pounds and developer behaviour — heading i (economic). Cooling/flood figures are supporting details.",
  "E is councils, fines, exemptions — heading v. Two distractors (vi wildlife, vii chemistry) are never used.",
];
const MOCK_TFNG = [
  { q: "6. Nineteenth-century cities contained no significant greenery.", a: "FALSE", w: "Paragraph A: orchards, commons and gardens were 'woven between streets' — direct contradiction." },
  { q: "7. A single tree can release more than 300 litres of water on a hot day.", a: "TRUE", w: "Paragraph B: 'over 400 litres' — 400 > 300, so TRUE." },
  { q: "8. Researchers have proven that views of trees cure illness.", a: "FALSE", w: "Paragraph C: 'not proof of cure' — 'cure' contradicts the text's caution." },
  { q: "9. London's trees are worth exactly £100 million per year.", a: "FALSE", w: "Paragraph D: 'over £100 million' — 'exactly' contradicts 'over'." },
];
const MOCK_COMP = [
  { q: "10. Bare neighbourhoods can be up to ___ hotter than leafy districts.", opts: ["3°C", "400 litres", "£100 million", "300 metres"], a: 0, w: "Paragraph B: 'up to 3°C lower' — leafy cooler = bare hotter by 3°C." },
  { q: "11. Hospital patients overlooking trees needed ___ painkillers.", opts: ["more", "fewer", "stronger", "imported"], a: 1, w: "Paragraph C: 'require fewer painkillers'." },
  { q: "12. Developers now use nearby trees as a ___ when selling homes.", opts: ["selling point", "legal obstacle", "construction cost", "felling fine"], a: 0, w: "Paragraph D: 'advertise proximity… as a selling point'." },
  { q: "13. Councils punish unauthorised felling with ___.", opts: ["rewards", "exemptions", "fines", "praise"], a: 2, w: "Paragraph E: 'introduced fines for felling'." },
];

export function ReadingMock() {
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(20 * 60);
  const [heads, setHeads] = useState<Record<number, number>>({});
  const [tfng, setTfng] = useState<Record<number, string>>({});
  const [comp, setComp] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (secs <= 0) { setRunning(false); return; }
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, secs]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const total = useMemo(() => {
    let c = 0;
    MOCK_HEAD_ANS.forEach((a, i) => { if (heads[i] === a) c++; });
    const tfAns = ["FALSE", "TRUE", "FALSE", "FALSE"];
    tfAns.forEach((a, i) => { if (tfng[i] === a) c++; });
    MOCK_COMP.forEach((q, i) => { if (comp[i] === q.a) c++; });
    return c;
  }, [heads, tfng, comp]);

  const band = total >= 12 ? "≈ Band 8.0–9.0 pace" : total >= 10 ? "≈ Band 7.0–7.5 pace" : total >= 8 ? "≈ Band 6.0–6.5 pace" : "Below 6.0 pace — review methods";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h2 className="font-serif text-2xl font-bold">Reading mock — 1 passage, 13 questions</h2>
          <p className="text-sm text-stone-500">Full test = 3 passages / 40 questions / 60 min. This is one passage at exam pace (20 min).</p></div>
        <Card className={cn("border px-4 py-2", secs < 300 ? "border-red-400 bg-red-50" : "border-stone-200 bg-white")}>
          <p className="flex items-center gap-2 font-mono text-2xl font-bold"><Clock className="h-5 w-5" /> {mm}:{ss}</p>
          <div className="mt-1 flex gap-1.5">
            {!running ? <Button size="sm" className="bg-teal-700" onClick={() => { setRunning(true); if (secs <= 0) setSecs(1200); }}>Start</Button>
              : <Button size="sm" variant="outline" onClick={() => setRunning(false)}>Pause</Button>}
            <Button size="sm" variant="outline" onClick={() => { setRunning(false); setSecs(1200); }}>Reset</Button>
          </div>
        </Card>
      </div>

      <Card className="mt-3 border-stone-200">
        <CardHeader><CardTitle className="text-lg">The Return of Urban Green Space</CardTitle><CardDescription>Read the passage, then answer Questions 1–13.</CardDescription></CardHeader>
        <CardContent className="space-y-2.5">{MOCK_PARAS.map(p => (
          <div key={p.label} className="rounded-md bg-stone-50 p-2.5 text-sm leading-relaxed"><p className="text-xs font-bold uppercase tracking-wide text-stone-500">{p.label}</p><p className="mt-0.5">{p.text}</p></div>
        ))}</CardContent>
      </Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <Card className="border-stone-200"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Heading className="h-4 w-4" /> Questions 1–5 · Match headings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md bg-stone-100 p-2 text-xs"><strong>Bank:</strong> {MOCK_HEADINGS.join(" · ")}</div>
              {MOCK_PARAS.map((p, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold">{i + 1}. {p.label}</p>
                  <select value={heads[i] ?? ""} disabled={checked} onChange={e => setHeads(prev => ({ ...prev, [i]: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm">
                    <option value="">— choose —</option>
                    {MOCK_HEADINGS.map((h, j) => <option key={h} value={j}>{h}</option>)}
                  </select>
                  {checked && <p className="mt-1 text-[13px]">{heads[i] === MOCK_HEAD_ANS[i] ? "✓ Correct. " : `✗ Answer: ${MOCK_HEADINGS[MOCK_HEAD_ANS[i]]}. `}{MOCK_HEAD_WHY[i]}</p>}
                </div>
              ))}
            </CardContent></Card>
          <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Questions 6–9 · TRUE / FALSE / NOT GIVEN</CardTitle></CardHeader>
            <CardContent className="space-y-3">{MOCK_TFNG.map((q, i) => (
              <div key={i}><p className="text-sm font-semibold">{q.q}</p>
                <div className="mt-1 flex gap-1.5">{["TRUE", "FALSE", "NOT GIVEN"].map(o => (
                  <button key={o} disabled={checked} onClick={() => setTfng(prev => ({ ...prev, [i]: o }))}
                    className={cn("rounded-md border px-2.5 py-1 text-xs font-bold", tfng[i] === o ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white")}>{o}</button>))}
                </div>
                {checked && <p className="mt-1 text-[13px]">{tfng[i] === q.a ? "✓ Correct. " : `✗ Answer: ${q.a}. `}{q.w}</p>}</div>
            ))}</CardContent></Card>
        </div>
        <div className="space-y-3">
          <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Questions 10–13 · Sentence completion</CardTitle><CardDescription>Choose the correct option for each.</CardDescription></CardHeader>
            <CardContent className="space-y-3">{MOCK_COMP.map((q, i) => (
              <div key={i}><p className="text-sm font-semibold">{q.q}</p>
                <div className="mt-1 space-y-1">{q.opts.map((o, j) => (
                  <button key={o} disabled={checked} onClick={() => setComp(prev => ({ ...prev, [i]: j }))}
                    className={cn("block w-full rounded-md border px-2.5 py-1.5 text-left text-sm", comp[i] === j ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white")}>{o}</button>))}
                </div>
                {checked && <p className="mt-1 text-[13px]">{comp[i] === q.a ? "✓ Correct. " : `✗ Answer: ${q.opts[q.a]}. `}{q.w}</p>}</div>
            ))}</CardContent></Card>
          <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Score</CardTitle></CardHeader>
            <CardContent>
              {!checked ? (
                <Button className="bg-stone-900" disabled={Object.keys(heads).length + Object.keys(tfng).length + Object.keys(comp).length < 13}
                  onClick={() => { setChecked(true); setRunning(false); }}>Mark my test</Button>
              ) : (
                <>
                  <p className="flex items-center gap-2 font-serif text-2xl font-bold"><Award className="h-6 w-6 text-amber-600" /> {total} / 13</p>
                  <div className="mt-1 text-sm"><Badge className="bg-teal-700">{band}</Badge></div>
                  <div className="mt-2 rounded-md bg-stone-100 p-2 text-xs">Full-test guide (40 Q): 30+ ≈ 7.0 · 33+ ≈ 7.5 · 35+ ≈ 8.0. This 13-question set scales the same way: 10+/13 ≈ Band 7 pace.</div>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => { setHeads({}); setTfng({}); setComp({}); setChecked(false); }}><RotateCcw className="mr-1 h-3.5 w-3.5" /> Retry</Button>
                </>
              )}
            </CardContent></Card>
        </div>
      </div>
    </div>
  );
}

// re-export small shared bits to avoid unused-import warnings in some builds
export function ReadingBadgeRow() {  return (
    <div className="flex flex-wrap gap-1.5">
      {[["40 Q", "3 passages"], ["60 min", "no transfer time"], ["Headings", "full lab inside"]].map(([a, b]) => (
        <span key={a} className="flex items-center gap-1 rounded-md bg-stone-100 px-2 py-1 text-xs"><ListChecks className="h-3 w-3" /><strong>{a}</strong> {b}</span>
      ))}
    </div>
  );
}
