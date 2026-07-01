'use client';

import React from 'react';
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionLead,
  Card,
  CardHeader,
  CardHeaderTitle,
  CardContent,
  CardFooter,
  CardFooterItem,
  Button,
  Callout,
  Quote,
  Badge,
  Tabs,
  Accordion,
  DataHighlight,
  PageHero,
  StatGrid,
  StatMetric,
  DerivedMetric,
  TechniqueGrid,
  SimulationPanel,
  Content,
  Stack,
  Text,
  Code,
  List,
  ListItem,
  type TechniqueItem,
} from 'glt-ui';

/**
 * Use-case-driven practical demo: an interactive research briefing that
 * composes design-system primitives into a real page (hero, live simulation,
 * filtered technique tabs, and expandable evidence). This is the "everything
 * together" counterpart to the per-component reference entries.
 */

const techs: TechniqueItem[] = [
  { id: 'claude-md', org: 'anthropic', title: 'Claude in Markdown', summary: 'Treat prompts + context as living docs checked into git.', impact: 'Dramatically lowers onboarding cost for agents.' },
  { id: 'plan-mode', org: 'anthropic', title: 'Plan Mode + Review Gates', summary: 'Force the model to produce a plan before touching code.', impact: 'Cuts bad diff churn by ~40%.' },
  { id: 'parallel-worktrees', org: 'anthropic', title: 'Parallel Worktrees + Agents', summary: 'Run N independent agent explorations in separate git worktrees.', impact: 'Parallelism becomes cheap.' },
  { id: 'codex-box', org: 'openai', title: 'Codex as Pair + Box', summary: 'Dedicated agent sandboxes with strict context windows.', impact: 'Reduces hidden state and surprise refactors.' },
  { id: 'feedback-first', org: 'general', title: 'Feedback-Delay as Primary Cost', summary: 'Optimize for shortest path to useful signal.', impact: 'Changes what "fast" means in engineering.' },
];

function Stepper({
  label,
  value,
  suffix,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <Stack direction="row" justify="between" align="center" gap={3}>
      <Text weight="medium">{label}</Text>
      <Stack direction="row" align="center" gap={2}>
        <Button
          size="icon"
          variant="outline"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - step))}
        >
          −
        </Button>
        <Text as="span" size="lg" weight="semibold" tone="strong" align="center" className="w-14">
          {value}
          {suffix}
        </Text>
        <Button
          size="icon"
          variant="outline"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + step))}
        >
          +
        </Button>
      </Stack>
    </Stack>
  );
}

export function PracticalDemo() {
  const [phase, setPhase] = React.useState(35);
  const [feedbackDelay, setFeedbackDelay] = React.useState(12);

  const computedCost = Math.round(100 - phase * 0.6 + feedbackDelay * 1.4);
  const savings = Math.max(5, Math.round((phase / 100) * 42 + (18 - feedbackDelay) * 1.1));

  const filteredTech = (org: string) => techs.filter((t) => org === 'all' || t.org === org);

  const handleTechniqueSelect = (item: TechniqueItem) => {
    alert(`(demo) Technique “${item.title}” selected — a real page could add it to a saved stack or re-compute a model.`);
  };

  const tabItems = [
    { id: 'all', label: 'All Techniques', content: <TechniqueGrid items={techs} onSelect={handleTechniqueSelect} /> },
    { id: 'anthropic', label: 'Anthropic', content: <TechniqueGrid items={filteredTech('anthropic')} onSelect={handleTechniqueSelect} /> },
    { id: 'openai', label: 'OpenAI', content: <TechniqueGrid items={filteredTech('openai')} onSelect={handleTechniqueSelect} /> },
    { id: 'general', label: 'General', content: <TechniqueGrid items={filteredTech('general')} onSelect={handleTechniqueSelect} /> },
  ];

  const accordionItems = [
    {
      id: 'thesis',
      title: 'The irreversible shift thesis',
      content: (
        <Content>
          The marginal cost of software change has collapsed. What used to require days of careful planning and expensive
          regression now costs minutes of agent time plus human judgment. The dominant remaining cost is feedback delay.
        </Content>
      ),
    },
    {
      id: 'methods',
      title: 'Evidence from production AI-native teams',
      content: (
        <Content className="space-y-3">
          <Text as="div">Anthropic reports 59% of new code authored with AI assistance; OpenAI internal teams run dozens of parallel agent experiments daily.</Text>
          <Text as="div">Traditional cost models (COCOMO, function points) no longer predict project economics once iteration cost falls below a threshold.</Text>
        </Content>
      ),
    },
    {
      id: 'actions',
      title: 'Actionable practices that compound',
      content: (
        <Content>
          <List spacing={1}>
            <ListItem>Store agent context as markdown in the repo</ListItem>
            <ListItem>Require explicit plan review before code edits</ListItem>
            <ListItem>Parallelize with worktrees + short-lived agent instances</ListItem>
            <ListItem>Measure and minimize time-to-useful-feedback</ListItem>
          </List>
        </Content>
      ),
    },
  ];

  return (
    <Stack gap={0} className="pb-16">
      <Section spacing="loose" className="pt-10 pb-8 border-b border-[var(--border-color)]">
        <PageHero
          badge={<Badge variant="fact">Research Report • 2026</Badge>}
          title={
            <>
              The Irreversible Costing Shift<br />in Software Engineering
            </>
          }
          lead="AI-native practices at Anthropic, OpenAI and peer labs have collapsed the cost of change. This interactive briefing is composed entirely from glt-ui primitives."
          actions={
            <>
              <Button size="lg" onClick={() => document.getElementById('demo-sim')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore the interactive model
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('demo-tech')?.scrollIntoView({ behavior: 'smooth' })}>
                See the techniques
              </Button>
            </>
          }
          footnote={
            <>
              Every element inherits from <Code>glt-ui</Code> theme tokens • Static-export friendly
            </>
          }
        />
      </Section>

      <Section spacing="tight">
        <StatGrid>
          <DataHighlight value={59} suffix="%" label="AI-authored code at Anthropic scale teams" change="+31pp" />
          <DataHighlight value={42} suffix="%" label="Typical reduction in time-to-feedback" change="↓" />
          <DataHighlight value={3.2} suffix="×" label="Throughput lift from parallel agent worktrees" />
        </StatGrid>
      </Section>

      <Section id="demo-sim" spacing="normal">
        <SectionHeader>
          <SectionTitle>The cost-of-change curve is now dramatically flatter.</SectionTitle>
          <SectionLead>
            Adjust the parameters below. The live model (pure client React state) recomputes an illustrative “effective
            cost index” — demonstrating state-driven components powered by the design system.
          </SectionLead>
        </SectionHeader>

        <SimulationPanel
          controls={
            <Card variant="research">
              <CardHeader>
                <CardHeaderTitle>Simulation controls</CardHeaderTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Stepper label="Adoption phase (maturity)" value={phase} min={0} max={100} step={10} suffix="%" onChange={setPhase} />
                <Stepper label="Feedback delay (days)" value={feedbackDelay} min={1} max={30} step={2} suffix="d" onChange={setFeedbackDelay} />
                <DerivedMetric label="Derived index (lower = cheaper change)" value={computedCost} />
              </CardContent>
              <CardFooter>
                <CardFooterItem>
                  <Text size="base">
                    Savings vs baseline: <Text as="span" weight="semibold" tone="brand">~{savings}%</Text>
                  </Text>
                </CardFooterItem>
              </CardFooter>
            </Card>
          }
          narrative={
            <>
              <Callout variant="fact" label="From research">
                “The primary cost of change increasingly becomes feedback delay, not development effort.” — adapted from industry analyses 2025–26
              </Callout>
              <StatGrid columns={2}>
                <StatMetric label="Current phase" value={phase} suffix="%" hint="Click card to advance maturity" interactive onClick={() => setPhase(Math.min(100, phase + 10))} />
                <StatMetric label="Feedback cycle" value={feedbackDelay} suffix="d" hint="Click to reduce delay" interactive onClick={() => setFeedbackDelay(Math.max(1, feedbackDelay - 2))} />
              </StatGrid>
              <Quote variant="highlight" size="md" source="Implication">
                Once teams internalize fast cheap iteration + parallel agentic execution, old cost assumptions stop making sense.
              </Quote>
            </>
          }
        />
      </Section>

      <Section id="demo-tech" spacing="normal">
        <SectionHeader>
          <SectionTitle>Techniques that drive the shift</SectionTitle>
          <SectionLead className="max-w-prose">
            Filter by source org. Cards use the <Code>TechniqueGrid</Code> primitive. Click a card to simulate adding it to your stack.
          </SectionLead>
        </SectionHeader>
        <Tabs items={tabItems} defaultId="all" />
      </Section>

      <Section spacing="normal">
        <SectionHeader>
          <SectionTitle>Key evidence &amp; practices (expandable)</SectionTitle>
        </SectionHeader>
        <Accordion items={accordionItems} multiple defaultOpen={['thesis']} />
      </Section>
    </Stack>
  );
}
