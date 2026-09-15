
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function DataTables({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Data Tables Deep-Dive
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Stop making your web apps look like unstyled Excel spreadsheets.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Right-align numbers"
        why="When numbers are left-aligned or centered, the decimal places and orders of magnitude don't line up, making it extremely difficult to compare values at a glance."
        doText="Always right-align columns containing monetary values, percentages, or comparable metrics. Align the column headers to match."
        dontText="Do not center-align numeric data."
        check="Do the decimal points or the last digits line up perfectly vertically?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Eliminate vertical borders"
        why="A full grid of borders traps data in little boxes, creating massive visual noise. Your eyes only need subtle horizontal lines to scan across a row."
        doText="Use wide padding and subtle horizontal borders (or zebra striping) to guide the eye. Let the negative space define the columns."
        dontText="Do not use vertical borders between columns unless the data is incredibly dense and complex."
        check="If I remove the vertical borders, is the table still easy to read? (It usually is.)"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Table Styling & Alignment"
        badLabel="Spreadsheet Style"
        goodLabel="Designed Table"
        bad={
          <div className="p-4 w-full text-sm">
            <table className="w-full border-collapse border border-surface-300">
              <thead className="bg-surface-100">
                <tr>
                  <th className="border border-surface-300 p-2 text-left font-bold">Asset</th>
                  <th className="border border-surface-300 p-2 text-center font-bold">Price</th>
                  <th className="border border-surface-300 p-2 text-center font-bold">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-surface-300 p-2">AAPL</td>
                  <td className="border border-surface-300 p-2 text-center">$150.25</td>
                  <td className="border border-surface-300 p-2 text-center">+1.2%</td>
                </tr>
                <tr>
                  <td className="border border-surface-300 p-2">GOOGL</td>
                  <td className="border border-surface-300 p-2 text-center">$2,800.10</td>
                  <td className="border border-surface-300 p-2 text-center">-0.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        }
        good={
          <div className="p-4 w-full text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-surface-200 pb-2 text-left font-semibold text-surface-500 text-xs tracking-wider uppercase">Asset</th>
                  <th className="border-b-2 border-surface-200 pb-2 text-right font-semibold text-surface-500 text-xs tracking-wider uppercase">Price</th>
                  <th className="border-b-2 border-surface-200 pb-2 text-right font-semibold text-surface-500 text-xs tracking-wider uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="text-surface-900">
                <tr className="hover:bg-surface-50 transition-colors">
                  <td className="border-b border-surface-100 py-3 font-medium">AAPL</td>
                  <td className="border-b border-surface-100 py-3 text-right tabular-nums">$150.25</td>
                  <td className="border-b border-surface-100 py-3 text-right tabular-nums text-success-600 font-medium">+1.2%</td>
                </tr>
                <tr className="hover:bg-surface-50 transition-colors">
                  <td className="border-b border-surface-100 py-3 font-medium">GOOGL</td>
                  <td className="border-b border-surface-100 py-3 text-right tabular-nums">$2,800.10</td>
                  <td className="border-b border-surface-100 py-3 text-right tabular-nums text-danger-600 font-medium">-0.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      />

    </div>
  );
}
