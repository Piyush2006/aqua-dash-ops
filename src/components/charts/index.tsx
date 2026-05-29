import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// SVG fill/stroke attributes do NOT resolve CSS var(), so we use literal values
// that mirror the design tokens in src/styles.css.
const PALETTE = [
  "oklch(0.42 0.16 258)", // chart-1 indigo
  "oklch(0.62 0.16 215)", // chart-2 cyan-blue
  "oklch(0.62 0.14 155)", // chart-3 green
  "oklch(0.72 0.16 75)",  // chart-4 amber
  "oklch(0.6 0.22 25)",   // chart-5 red
  "oklch(0.55 0.18 295)", // chart-6 violet
];

const COLOR_BORDER = "oklch(0.92 0.008 250)";
const COLOR_MUTED_FG = "oklch(0.55 0.02 250)";
const COLOR_SURFACE = "oklch(0.97 0.005 250)";
const COLOR_POPOVER = "#ffffff";
const COLOR_BG = "#ffffff";

const pickColor = (override: string | undefined, i: number) => override ?? PALETTE[i % PALETTE.length];

const axisProps = {
  stroke: COLOR_MUTED_FG,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: COLOR_POPOVER,
    border: `1px solid ${COLOR_BORDER}`,
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.15)",
  } as React.CSSProperties,
  labelStyle: { color: COLOR_MUTED_FG, fontWeight: 500, fontSize: 11 } as React.CSSProperties,
};

export function TrendLine({ data, x, series, height = 260 }: { data: any[]; x: string; series: { key: string; label: string; color?: string }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLOR_BORDER} vertical={false} />
        <XAxis dataKey={x} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {series.map((s, i) => {
          const c = pickColor(s.color, i);
          return (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={c} strokeWidth={2.5} dot={{ r: 3, fill: c, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TrendArea({ data, x, series, height = 260 }: { data: any[]; x: string; series: { key: string; label: string; color?: string }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          {series.map((s, i) => {
            const c = pickColor(s.color, i);
            return (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity={0.35} />
                <stop offset="100%" stopColor={c} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLOR_BORDER} vertical={false} />
        <XAxis dataKey={x} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {series.map((s, i) => {
          const c = pickColor(s.color, i);
          return (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={c} strokeWidth={2} fill={`url(#grad-${s.key})`} />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarsChart({ data, x, series, height = 260, stacked = false }: { data: any[]; x: string; series: { key: string; label: string; color?: string }[]; height?: number; stacked?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="22%">
        <defs>
          {series.map((s, i) => {
            const c = pickColor(s.color, i);
            return (
              <linearGradient key={s.key} id={`bar-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity={0.95} />
                <stop offset="100%" stopColor={c} stopOpacity={0.65} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLOR_BORDER} vertical={false} />
        <XAxis dataKey={x} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} cursor={{ fill: COLOR_SURFACE, opacity: 0.5 }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={`url(#bar-${s.key})`} radius={stacked ? [0, 0, 0, 0] : [6, 6, 0, 0]} stackId={stacked ? "a" : undefined} maxBarSize={48} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, height = 240, innerRadius = 60, outerRadius = 90 }: { data: { name: string; value: number; color?: string }[]; height?: number; innerRadius?: number; outerRadius?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} stroke={COLOR_BG} strokeWidth={3}>
          {data.map((d, i) => (
            <Cell key={i} fill={pickColor(d.color, i)} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ data, color = PALETTE[0], height = 40 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
