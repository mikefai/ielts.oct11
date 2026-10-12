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
          { id: "rmock" as RSection, t: "Mock test", d: "One full passage, 14 questions, 20:00 timer, answer key + band scale.", c: "Start mock" },
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
  "i. The scale of a squandered resource",
  "ii. Refuse richer than rock",
  "iii. Why extraction resists easy solutions",
  "iv. Microbes as metallurgists",
  "v. Law and prices as drivers",
  "vi. Recovery alone cannot satisfy demand",
  "vii. The invention of the smartphone",
  "viii. Health effects of informal recycling",
];
const NAP_PARAS = [
  { label: "Paragraph A", text: "On the outskirts of Accra lies Agbogbloshie, a scrapyard where thousands dismantle the rich world's discarded electronics by hand — the most visible tip of a torrent few consumers ever consider. Humanity now abandons more than 50 million tonnes of electrical goods each year, a flow expanding three times faster than the population itself, and barely 17% is formally recycled; the rest is landfilled, incinerated or exported to yards like Agbogbloshie, where recovery is crude and hazardous. The Global E-waste Monitor, which compiles these figures, warns the total could approach 75 million tonnes by 2030. Such sites also hint at what is squandered: every tonne carries off copper, silver and rare earths in concentrations that took geological ages to accumulate.", answer: 0, why: "Opens on Agbogbloshie but generalises to global tonnage (50Mt, 17%, 75Mt projection) and closes on squandered concentrations — heading i. 'Hazardous' tempts viii, but health is scene-setting for a paragraph about scale." },
  { label: "Paragraph B", text: "Conventional mining offers a striking yardstick. A tonne of typical gold ore surrenders barely five grams of metal after crushing, grinding and chemical treatment on an industrial scale — an enterprise that devours energy and water. Set against this, the contents of a tonne of discarded smartphones, holding roughly 300 times more gold alongside palladium concentrations that mine managers would celebrate, look less like rubbish than like the richest deposit never quarried. Whether such grades can be liberated economically is, admittedly, another question entirely; as ore, however, researchers now rank cities above almost anything left in the ground.", answer: 1, why: "A sustained comparison — five grams per tonne of ore versus 300 times more in phones — closing with cities ranked above natural deposits: heading ii. The final 'economically… another question' is an aside pointing at paragraph C, not this paragraph's topic." },
  { label: "Paragraph C", text: "Such grades have bred considerable optimism — and, among engineers, no small impatience with regulators, who have been slow to standardise collection. The impatience is premature. Contemporary devices fuse dozens of elements into millimetre-scale assemblies: shredding them yields a mixed granulate from which separation is costly, while manual disassembly is labour-intensive and exposes workers to lead and brominated flame retardants. Few smelters will accept such feedstock, and those that do charge accordingly. Even the richest urban ore is worthless if unpicking it costs more than its metals — a calculation that currently defeats all but a handful of specialised plants. The obstacle, in short, is not policy but physics and chemistry.", answer: 2, why: "Optimism raised only to be dismissed ('premature'; 'not policy but physics and chemistry'), with three barriers in between — heading iii. The regulators sentence tempts v, but the paragraph explicitly rejects it." },
  { label: "Paragraph D", text: "Conventional metallurgy answers complexity with brute force: furnaces exceeding 1,200°C and baths of acid that themselves become hazardous waste. A quieter alternative has emerged from microbiology. Certain bacteria and fungi naturally leach copper and gold from crushed circuit boards at room temperature, asking only time — weeks rather than hours — in return. Pilot facilities in Finland and Japan have demonstrated that, where electricity is dear or discharge rules stringent, these living reagents can already undercut smelters. Biology, in other words, is beginning to do the work of furnaces.", answer: 3, why: "Furnaces are described only to contrast the microbial alternative (room temperature, pilots undercutting smelters) — heading iv. 'Weeks rather than hours' is a conceded drawback, and concessions are never the main idea." },
  { label: "Paragraph E", text: "Engineers like to credit improving recovery rates to better technology, and technology has indeed advanced. Yet the decisive shifts have come from elsewhere. Landfill bans across the European Union and extended producer-responsibility laws in Japan now compel manufacturers to finance collection networks, while commodity markets furnish the parallel incentive: when lithium prices spiked in 2022, investment in battery recycling tripled within eighteen months — then stalled as prices collapsed again. Innovation opens the door, but law and prices determine who walks through it, and neither driver shows signs of weakening.", answer: 4, why: "Technology is credited then subordinated ('decisive shifts have come from elsewhere') to bans and markets — heading v. The lithium bust illustrates market-driven cycles; it does not argue recycling falls short (vi)." },
  { label: "Paragraph F", text: "Recycling's advocates can point to genuine triumphs — lead-acid battery recovery exceeds 95% in regulated markets — but phones are not batteries. Surveys repeatedly find households hoarding obsolete handsets, an estimated 16 billion sitting idle in drawers worldwide, a stockpile recyclers cannot reach, so formal collection rates languish below 25% in most economies. Meanwhile metals demand is projected to double by 2040. Analysts setting the two trajectories side by side conclude that recycling, even perfectly executed, could furnish at most a third of requirements; primary mining, for the foreseeable future, remains unavoidable.", answer: 5, why: "The battery triumph is conceded then contrasted ('but phones are not batteries'); hoarding plus doubling demand lead to the verdict that mining is unavoidable — heading vi. The 95% figure is the concession, not the conclusion." },
];

const TRAP_QUIZ: MCQ[] = [
  { q: "A paragraph opens with evidence FOR urban mining, then 'Nevertheless…' reverses to its limits. The heading should reflect…", options: ["the opening evidence — first sentences rule", "the paragraph's overall direction after the turn", "whichever half shares more words with a heading"], answer: 1, explain: "Contrast structures pivot on 'however/nevertheless'. The main idea is where the paragraph ENDS UP, not where it starts — a favourite Band 7+ trap." },
  { q: "A statement says 'most researchers agree'. The text says 'several researchers argue'. This is…", options: ["TRUE — several means most", "FALSE — quantifier mismatch: several ≠ most", "NOT GIVEN — we can't count researchers"], answer: 1, explain: "'Most' is a claim about the majority; 'several' doesn't support it. Quantifier shifts (some/most/all) flip answers — always compare them exactly." },
  { q: "Two headings fit different HALVES of one paragraph (problem + solution). You should…", options: ["pick the problem heading — problems come first", "pick whichever half is longer", "decide which half the paragraph's conclusion serves, and check the other paragraphs first"], answer: 2, explain: "Match the paragraph's FUNCTION. And solve easy paragraphs first — elimination often resolves the dilemma for free." },
  { q: "The instructions say 'Choose the correct letter A–G'. You…", options: ["may reuse a letter if two paragraphs match it", "must use each letter exactly once, leaving spares unused", "should leave blanks rather than guess"], answer: 1, explain: "Unless told otherwise, each heading is used once and some never. Never leave blanks — there is no penalty for wrong answers." },
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
      <CardHeader><CardTitle className="text-lg">Drill A · Match the 6 paragraphs</CardTitle>
        <CardDescription>Passage: "Urban Mining: Harvesting Metals from Waste". Two headings are distractors and must be left unused. Exam-length paragraphs with buried topic sentences — read each one to the end.</CardDescription></CardHeader>
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
            : <><Badge className={score >= 80 ? "bg-teal-700" : "bg-amber-600"}>{score}% ({NAP_PARAS.filter((p, i) => sel[i] === p.answer).length}/6)</Badge>
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
  { q: "Passage: 'A 2023 Osaka trial grew lettuce under pink LED arrays, yielding 40% more biomass than greenhouse controls, although energy consumption was three times higher. The team tested leafy greens only and cautioned that fruiting crops might respond differently, while noting that no measurements of flavour compounds were taken.' Statement: 'The Osaka trial produced 40% more lettuce than a conventional greenhouse.'", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: 0, explain: "'40% more biomass' of lettuce = 40% more lettuce. Different grammar, same fact → TRUE. Paraphrase is the norm, not word-matching." },
  { q: "Same passage. Statement: 'The trial demonstrated that vertical farms are more profitable than greenhouses.'", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: 2, explain: "Profitability is never assessed. Higher energy costs SUGGEST otherwise, but suggestions aren't statements — a classic feel-FALSE-actually-NG trap." },
  { q: "Same passage. Statement: 'Fruiting crops were found to react badly to pink LED light.'", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: 1, explain: "'Might respond differently' (untested, hedged) vs 'were found to react badly' (tested, certain) — the certainty level contradicts → FALSE." },
  { q: "Same passage. Statement: 'Flavour compounds in the lettuce were left unmeasured.'", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: 0, explain: "'No measurements… were taken' = left unmeasured. Nominalisation ('measurements') hiding a simple verb — typical exam paraphrase." },
];
const EX_YNNG: MCQ[] = [
  { q: "Passage: 'Dr Marsh dismisses rewilding Britain as ecological fantasy, insisting reintroduced wolves would devastate livestock. Professor Adeyemi counters that Dutch compensation schemes have contained such losses, though she concedes public fear remains a genuine obstacle. Reviewing both cases, the author concludes that beavers — reintroduced with minimal dispute — expose the exaggeration on each side.' Statement: 'Marsh regards wolves as harmless to farm animals.'", options: ["YES", "NO", "NOT GIVEN"], answer: 1, explain: "Marsh insists wolves would 'devastate livestock' — the statement claims the opposite of his view → NO." },
  { q: "Same passage. Statement: 'Adeyemi believes public anxiety is entirely baseless.'", options: ["YES", "NO", "NOT GIVEN"], answer: 1, explain: "She calls fear 'a genuine obstacle' — 'entirely baseless' contradicts her concession. Absolutes (entirely/only/always) are the commonest NO-triggers." },
  { q: "Same passage. Statement: 'The writer suggests both researchers overstate their cases.'", options: ["YES", "NO", "NOT GIVEN"], answer: 0, explain: "'Expose the exaggeration on each side' = both overstate. 'Each side' maps to Marsh and Adeyemi — track WHO the evaluation attaches to." },
];
const EX_ENDINGS: MCQ[] = [
  { q: "Text: 'Although vertical farms out-yield greenhouses per square metre, their electricity bills render them uncompetitive for staple crops; they remain viable chiefly for high-value leafy greens near cities, where transport savings offset power costs.' Ending for 'Although vertical farms out-yield greenhouses per square metre,…'", options: ["…their power costs make staples uneconomic.", "…they consume less electricity than open fields.", "…staples are their principal product."], answer: 0, explain: "'Render them uncompetitive for staple crops' = make staples uneconomic. B and C each contradict one clause — check EVERY clause, not just the first." },
  { q: "Same text. Ending for 'Because transport savings offset power costs,…'", options: ["…inner-city leafy greens can pay their way.", "…electricity costs nothing in urban areas.", "…staple crops should relocate indoors."], answer: 0, explain: "'Remain viable chiefly for high-value leafy greens near cities' = inner-city greens pay. B overstates ('nothing'); C reverses the text's verdict on staples." },
  { q: "Text: 'Unlike advocates who stress yields, the authors maintain that without cheap clean energy, expanding indoor farming would raise emissions.' Ending for 'Unlike advocates, the authors…'", options: ["…warn expansion could increase emissions.", "…endorse the advocates' emphasis.", "…deny that yields are higher indoors."], answer: 0, explain: "The 'unlike' contrast is views, not yields: advocates stress yields, authors warn on emissions. They never dispute the yields — C invents a disagreement." },
];
const EX_SUMMARY: MCQ[] = [
  { q: "Text: 'Seawater is first forced through intake screens that exclude marine life. It then undergoes pre-treatment, in which chemicals coagulate suspended particles. The clarified water passes to reverse-osmosis membranes at high pressure, producing freshwater plus a concentrated brine that is diluted before discharge.' Flow-chart: Intake screens → [___] → reverse osmosis. Bank: pre-treatment / screening / pressure.", options: ["pre-treatment", "screening", "pressure"], answer: 0, explain: "The stage AFTER intake is pre-treatment. 'Screening' reuses the previous stage's word (same -ing class, wrong position); 'pressure' belongs to the osmosis stage." },
  { q: "Same text. Flow-chart: brine is [___] before release. Bank: diluted / discharged / dilution.", options: ["diluted", "discharged", "dilution"], answer: 0, explain: "'Is diluted before discharge' — you need the participle 'diluted'. 'Discharged' confuses the two verbs; 'dilution' is the wrong word class for the gap." },
  { q: "Same text. Gap: 'Suspended particles are removed by [___] during pre-treatment.' Bank: coagulation / membranes / screens.", options: ["coagulation", "membranes", "screens"], answer: 0, explain: "'Chemicals coagulate particles' → nominalised as 'coagulation'. 'Screens' and 'membranes' are real stages — but the WRONG stages for this gap." },
];
const EX_FEATURES: MCQ[] = [
  { q: "Text: 'Dr Ito attributes street cooling primarily to transpiration, regarding shade as a secondary effect. Dr Silva disputes this, crediting reflective leaf surfaces instead and judging transpiration's contribution negligible. Dr Okafor, reviewing both studies, finds the mechanisms roughly equal and criticises single-factor explanations on either side.' Who treats shade as the lesser factor?", options: ["Dr Ito", "Dr Silva", "Dr Okafor", "All three"], answer: 0, explain: "Ito: transpiration primary, shade 'secondary'. Scan the NAME, then read the claim attached to it — never match claims to the nearest name." },
  { q: "Same text. Who considers transpiration negligible?", options: ["Dr Ito", "Dr Silva", "Dr Okafor", "None of them"], answer: 1, explain: "Silva judges transpiration's contribution 'negligible' — then credits reflective surfaces instead. 'Instead' signals the replacement claim." },
  { q: "Same text. Who attacks one-sided explanations?", options: ["Dr Ito", "Dr Silva", "Dr Okafor", "All three"], answer: 2, explain: "Okafor 'criticises single-factor explanations on either side'. Note 'either side' = both rivals — an evaluation of the DEBATE, not a new finding." },
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
  { label: "Paragraph A", text: "In the 1990s, municipal planners regarded street trees as ornament — agreeable but ultimately expendable when carriageways needed widening. Hundreds of mature specimens were felled annually with scant public objection, for canopy cover was then measured, if at all, in aesthetic rather than economic or medical terms.", point: "Old attitude: trees as expendable ornament; value seen as aesthetic only." },
  { label: "Paragraph B", text: "Calibrated measurement has since altered the arithmetic. A 2018 survey spanning six cities found that densely canopied streets averaged 2.4°C cooler at summer peaks, with adjacent households consuming 18% less electricity for cooling — savings that, aggregated city-wide, run into millions.", point: "Hard evidence: 2.4°C cooler, 18% less cooling energy (figures)." },
  { label: "Paragraph C", text: "Medical researchers have supplied a second, more contested rationale. Cohorts of children residing within 300 metres of substantial greenery exhibit markedly lower asthma prevalence, a pattern replicated across three countries. Sceptics reply that leafier districts also tend to be wealthier, with superior healthcare access, leaving causation stubbornly unresolved.", point: "Health claim PLUS the counter-argument (wealth confound) — evaluative territory." },
  { label: "Paragraph D", text: "Legislation has trailed the evidence, and patchily. A handful of councils now prohibit felling above a stipulated trunk diameter, yet exemptions for development remain generous and enforcement budgets thin. The direction of travel, nevertheless, points unmistakably toward preservation.", point: "Uneven policy today, but overall direction = preservation." },
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
  "i. A brightening planet, measured from orbit",
  "ii. How light resets the body's clockwork",
  "iii. Shift work and the cancer question",
  "iv. Casualties beyond our own species",
  "v. Efficient lamps with hidden costs",
  "vi. Gaps in what science can say",
  "vii. The history of gas street lighting",
  "viii. Treating sleep disorders with light therapy",
];
const MOCK_PARAS = [
  { label: "Paragraph A", text: "Four-fifths of humanity now live beneath light-polluted skies, and the glow is intensifying. Analysing satellite imagery from 2012 to 2016, Kyba and colleagues calculated that artificially lit surfaces were expanding by 2.2% each year — and ground-based photometers suggest even this understates the trend, since older sensors are blind to the blue-rich LEDs now dominating street lighting. Darkness, by this measure, is receding on every inhabited continent." },
  { label: "Paragraph B", text: "The human body reads this glow as information. Intrinsically photosensitive cells in the retina signal the brain's master clock, suppressing the sleep hormone melatonin — an effect strongest for short-wavelength blue light. The 2017 Nobel Prize in Physiology honoured Hall, Rosbash and Young for unravelling the molecular feedback loops behind such rhythms, work revealing clock genes ticking in nearly every tissue, from liver to skin." },
  { label: "Paragraph C", text: "Epidemiology has linked chronic exposure to harm, most contentiously through night-shift labour. Citing cohort studies of nurses, the International Agency for Research on Cancer classifies night-shift work as 'probably carcinogenic' — Group 2A, reaffirmed in 2019 — yet the associated risks are modest, on the order of a 20% elevation, and entangled with confounders: shift workers smoke more, exercise less and tend to be poorer. Whether light itself, or the lifestyle accompanying it, drives the association remains vigorously disputed." },
  { label: "Paragraph D", text: "Other species fare no better, sometimes worse. Moths spiral around lamps until exhausted; hatchling sea turtles, evolved to scuttle toward moonlit surf, instead wander inland toward coastal glow; dung beetles, which steer by the Milky Way, lose their compass under skyglow. Each mechanism is documented in field experiments, though what these individual misfortunes mean for whole populations is, researchers admit, largely unquantified." },
  { label: "Paragraph E", text: "The current transition to LEDs sharpens every dilemma. Municipalities have halved their lighting energy bills by adopting diodes, accelerating the rollout — yet diode spectra peak precisely in the blue band that most suppresses melatonin and most disorients insects. Remedies exist: shielding that aims light downward, dimming after midnight, amber-shifted lamps. As the physicist Hölker observes, societies could retain illumination while discarding much of its glow; that they rarely do is attributed principally to cost." },
  { label: "Paragraph F", text: "Fundamental uncertainties persist. No regulatory body has fixed a threshold dose below which night-time light is deemed safe, and laboratory exposures typically dwarf real-world levels, limiting how far findings generalise. Sensitivity further varies with age and chronotype — self-described night owls appear somewhat less perturbed. Until longitudinal studies mature, official guidance rests explicitly on precaution rather than proof." },
];
const MOCK_HEAD_ANS = [0, 1, 2, 3, 4, 5];
const MOCK_HEAD_WHY = [
  "A quantifies planetary brightening (four-fifths, 2.2% yearly, satellites vs ground sensors) — heading i. The LED-sensor detail tempts heading v, but lamps are evidence here, not the topic.",
  "B explains the retinal–melatonin mechanism and clock genes — heading ii. The Nobel is supporting prestige, not history (vii); therapy (viii) is never mentioned.",
  "C weighs shift-work cancer evidence with confounders and dispute — heading iii. The '20% elevation' and 'probably' qualifiers are detail, not the main idea.",
  "D catalogues moths, turtles and beetles — harm beyond humans — heading iv. Population effects being 'unquantified' is the paragraph's honest coda, reused in Q10.",
  "E contrasts LED savings against blue-spectrum costs plus remedies — heading v. Hölker's quote supports the cost verdict; it is not the paragraph's subject.",
  "F inventories unknowns (no threshold, lab-vs-world gap, chronotypes) — heading vi. Precaution-vs-proof is the closing line, not a separate topic.",
];
const MOCK_TFNG = [
  { q: "7. Between 2012 and 2016, lit surfaces worldwide expanded by about 2% per year.", a: "TRUE", w: "Paragraph A: 2.2% yearly — 'about 2%' is legitimate approximation. Examiners accept rounded paraphrase as TRUE." },
  { q: "8. The 2017 Nobel Prize in Physiology honoured research into nurses' working hours.", a: "FALSE", w: "Paragraph B: the prize honoured molecular clockwork (Hall, Rosbash, Young). Nurses appear only in paragraph C's cancer cohorts — a cross-paragraph decoy." },
  { q: "9. Scientists have established a precise safe limit for night-time light exposure.", a: "FALSE", w: "Paragraph F: no body 'has fixed a threshold dose'. 'Precise safe limit' directly contradicts this." },
  { q: "10. Skyglow has been shown to shrink overall moth populations.", a: "NOT GIVEN", w: "Paragraph D documents exhausted individuals but states population consequences are 'largely unquantified'. Plausible, suggestive — but unstated. Feel-TRUE, actually-NG." },
];
const MOCK_COMP = [
  { q: "11. Melatonin is most strongly suppressed by ___ wavelengths.", opts: ["short blue", "long red", "green", "infrared"], a: 0, w: "Paragraph B: 'strongest for short-wavelength blue light'. Note 'short' modifies the wavelength, not the duration." },
  { q: "12. The WHO agency regards night-shift work as ___ carcinogenic to humans.", opts: ["probably", "certainly", "possibly", "unlikely to be"], a: 0, w: "Paragraph C: Group 2A = 'probably carcinogenic'. 'Possibly' (Group 2B) is the planted near-miss — precision with qualifiers scores." },
  { q: "13. Dung beetles navigate using the ___.", opts: ["Milky Way", "moon", "sun", "magnetic field"], a: 0, w: "Paragraph D: beetles 'steer by the Milky Way'. The moon belongs to the TURTLES' sentence — a deliberate cross-detail trap." },
  { q: "14. Official guidance on night lighting currently rests on ___ rather than conclusive evidence.", opts: ["precaution", "profit", "tradition", "guesswork"], a: 0, w: "Paragraph F: 'rests explicitly on precaution rather than proof'. 'Guesswork' editorialises — the text's own noun is 'precaution'." },
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
    const tfAns = ["TRUE", "FALSE", "FALSE", "NOT GIVEN"];
    tfAns.forEach((a, i) => { if (tfng[i] === a) c++; });
    MOCK_COMP.forEach((q, i) => { if (comp[i] === q.a) c++; });
    return c;
  }, [heads, tfng, comp]);

  const band = total >= 13 ? "≈ Band 8.0–9.0 pace" : total >= 11 ? "≈ Band 7.0–7.5 pace" : total >= 9 ? "≈ Band 6.0–6.5 pace" : "Below 6.0 pace — review methods";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h2 className="font-serif text-2xl font-bold">Reading mock — 1 passage, 14 questions</h2>
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
        <CardHeader><CardTitle className="text-lg">Losing the Night: Artificial Light and Health</CardTitle><CardDescription>Read the passage, then answer Questions 1–14.</CardDescription></CardHeader>
        <CardContent className="space-y-2.5">{MOCK_PARAS.map(p => (
          <div key={p.label} className="rounded-md bg-stone-50 p-2.5 text-sm leading-relaxed"><p className="text-xs font-bold uppercase tracking-wide text-stone-500">{p.label}</p><p className="mt-0.5">{p.text}</p></div>
        ))}</CardContent>
      </Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <Card className="border-stone-200"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Heading className="h-4 w-4" /> Questions 1–6 · Match headings</CardTitle></CardHeader>
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
          <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Questions 7–10 · TRUE / FALSE / NOT GIVEN</CardTitle></CardHeader>
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
          <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Questions 11–14 · Sentence completion</CardTitle><CardDescription>Choose the correct option for each.</CardDescription></CardHeader>
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
                <Button className="bg-stone-900" disabled={Object.keys(heads).length + Object.keys(tfng).length + Object.keys(comp).length < 14}
                  onClick={() => { setChecked(true); setRunning(false); }}>Mark my test</Button>
              ) : (
                <>
                  <p className="flex items-center gap-2 font-serif text-2xl font-bold"><Award className="h-6 w-6 text-amber-600" /> {total} / 14</p>
                  <div className="mt-1 text-sm"><Badge className="bg-teal-700">{band}</Badge></div>
                  <div className="mt-2 rounded-md bg-stone-100 p-2 text-xs">Full-test guide (40 Q): 30+ ≈ 7.0 · 33+ ≈ 7.5 · 35+ ≈ 8.0. This 14-question set scales the same way: 11+/14 ≈ Band 7 pace.</div>
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
