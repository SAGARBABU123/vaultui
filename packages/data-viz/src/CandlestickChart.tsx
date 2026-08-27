import { cn } from "@gudipudimani/utils";

export interface Candlestick {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps {
  data: Candlestick[];
  className?: string;
}

const W = 170;
const H = 100;
const PAD = { top: 6, right: 8, bottom: 16, left: 8 };

/**
 * CandlestickChart — OHLC candles with wicks, volume-coded bodies
 * and a dashed last-price line. Pure SVG.
 */
export function CandlestickChart({ data, className }: CandlestickChartProps) {
  const highs = data.map((d) => d.high);
  const lows = data.map((d) => d.low);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const range = max - min || 1;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const y = (v: number) => PAD.top + ((max - v) / range) * plotH;
  const slot = plotW / data.length;
  const bodyW = Math.max(2, slot * 0.55);
  const lastClose = data[data.length - 1]?.close;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full aspect-[17/10]", className)} role="img" aria-label="Candlestick chart">
      {/* grid */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={PAD.left} x2={W - PAD.right} y1={PAD.top + plotH * f} y2={PAD.top + plotH * f} stroke="currentColor" strokeOpacity="0.08" />
      ))}

      {data.map((d, i) => {
        const cx = PAD.left + slot * i + slot / 2;
        const up = d.close >= d.open;
        const color = up ? "text-success-500" : "text-danger-500";
        const bodyTop = y(Math.max(d.open, d.close));
        const bodyH = Math.max(1, Math.abs(y(d.open) - y(d.close)));
        return (
          <g key={i} className={color}>
            <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} stroke="currentColor" strokeWidth="1" />
            <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} rx="0.8" fill="currentColor" />
          </g>
        );
      })}

      {/* last price line */}
      {lastClose !== undefined && (
        <g>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(lastClose)} y2={y(lastClose)} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="2 2" />
          <text x={W - PAD.right} y={y(lastClose) - 2} textAnchor="end" fontSize="7" fill="currentColor" fillOpacity="0.6">
            {lastClose}
          </text>
        </g>
      )}

      {/* x labels */}
      {data.map((d, i) => {
        const cx = PAD.left + slot * i + slot / 2;
        if (i % Math.ceil(data.length / 5) !== 0) return null;
        return (
          <text key={i} x={cx} y={H - 4} textAnchor="middle" fontSize="7" fill="currentColor" fillOpacity="0.5">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}