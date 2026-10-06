
import { Card } from "../ui/Card";

export function DesignTokens({ agentMode }: { agentMode: boolean }) {
  if (agentMode) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4 font-mono">SYSTEM_TOKENS</h2>
        <p className="mb-4">Agents MUST use constrained scales instead of arbitrary values.</p>
        <pre className="bg-surface-900 text-surface-300 p-4 rounded-lg overflow-x-auto text-sm">
{`SPACING: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px, 96px, 128px
(Tailwind: 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32)

TYPOGRAPHY: 12px (xs), 14px (sm), 16px (base), 18px (lg), 20px (xl), 24px (2xl), 30px (3xl), 36px (4xl)

COLORS (Neutral):
50:  #faf9f8 (App Background)
100: #f4f3f1 (Card Hover / Borders)
200: #e8e6e1 (Borders)
500: #a49f93 (Muted Icons)
600: #888377 (Secondary Text)
900: #34312b (Primary Text)

SHADOWS:
sm: Clickable items (buttons, cards)
md: Dropdowns, popovers
lg: Modals, dialogs`}
        </pre>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Design Tokens
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          The constrained systems that power consistent decision making.
        </p>
      </div>

      <section>
        <h3 className="text-2xl font-bold mb-6 text-surface-800">Spacing Scale</h3>
        <p className="text-surface-600 mb-8">Used for margins, padding, and layout gaps. Avoid arbitrary pixel values.</p>
        <div className="space-y-4">
          {[
            { token: '4', px: '16px' },
            { token: '6', px: '24px' },
            { token: '8', px: '32px' },
            { token: '12', px: '48px' },
            { token: '16', px: '64px' },
          ].map((space) => (
            <div key={space.token} className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-surface-500 text-right">space-{space.token}</div>
              <div className="w-16 text-sm font-mono text-surface-400">{space.px}</div>
              <div className="bg-brand-200 h-4 rounded-sm" style={{ width: space.px }}></div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-6 text-surface-800">Typography Scale</h3>
        <Card className="p-8 space-y-8">
          {[
            { token: 'text-xs', size: '12px', class: 'text-xs' },
            { token: 'text-sm', size: '14px', class: 'text-sm' },
            { token: 'text-base', size: '16px', class: 'text-base' },
            { token: 'text-lg', size: '18px', class: 'text-lg' },
            { token: 'text-xl', size: '20px', class: 'text-xl font-display' },
            { token: 'text-2xl', size: '24px', class: 'text-2xl font-display font-medium' },
            { token: 'text-3xl', size: '30px', class: 'text-3xl font-display font-semibold' },
          ].map((type) => (
            <div key={type.token} className="flex items-baseline gap-8 border-b border-surface-100 pb-4 last:border-0 last:pb-0">
              <div className="w-24 shrink-0 text-sm font-medium text-surface-500">{type.token}</div>
              <div className="w-12 shrink-0 text-sm font-mono text-surface-400">{type.size}</div>
              <div className={`truncate text-surface-900 ${type.class}`}>The quick brown fox jumps over the lazy dog</div>
            </div>
          ))}
        </Card>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-6 text-surface-800">Color System</h3>
        <p className="text-surface-600 mb-8">A 50-900 scale for neutral and primary tones.</p>
        
        <div className="mb-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-surface-500 mb-3">Neutral (Tinted)</h4>
          <div className="flex h-16 rounded-lg overflow-hidden shadow-sm">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
              <div key={weight} className="flex-1 flex items-end justify-center pb-2" style={{ backgroundColor: "var(--color-surface-" + weight + ")" }}>
                <span className={`text-xs font-mono ${weight > 400 ? 'text-white/70' : 'text-black/50'}`}>{weight}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-surface-500 mb-3">Primary (Brand)</h4>
          <div className="flex h-16 rounded-lg overflow-hidden shadow-sm">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
              <div key={weight} className="flex-1 flex items-end justify-center pb-2" style={{ backgroundColor: "var(--color-brand-" + weight + ")" }}>
                <span className={`text-xs font-mono ${weight > 400 ? 'text-white/70' : 'text-black/50'}`}>{weight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
