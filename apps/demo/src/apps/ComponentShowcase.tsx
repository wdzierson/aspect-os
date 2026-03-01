import { useState } from 'react';
import {
  Plus, TrendingUp, TrendingDown, Info, CheckCircle2, AlertTriangle, XCircle,
  Search, ChevronDown, ArrowUpDown,
} from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) {
  const styles: Record<string, string> = {
    default: 'bg-primary/15 text-primary',
    secondary: 'bg-muted text-muted-foreground',
    success: 'bg-green-500/15 text-green-600',
    warning: 'bg-amber-500/15 text-amber-600',
    destructive: 'bg-destructive/15 text-destructive',
    outline: 'border border-border text-foreground',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant] ?? styles.default}`}>
      {children}
    </span>
  );
}

const KPI_DATA = [
  { label: 'Total Users', value: '12,847', trend: '+12.5%', up: true },
  { label: 'Revenue', value: '$48,290', trend: '+8.2%', up: true },
  { label: 'Active Sessions', value: '1,423', trend: '-3.1%', up: false },
  { label: 'Conversion Rate', value: '3.24%', trend: '+0.8%', up: true },
];

const TABLE_DATA = [
  { name: 'Alice Johnson', status: 'Active', role: 'Admin', lastActive: '2 min ago' },
  { name: 'Bob Chen', status: 'Active', role: 'Editor', lastActive: '15 min ago' },
  { name: 'Carol Davis', status: 'Away', role: 'Viewer', lastActive: '1 hour ago' },
  { name: 'Dan Wilson', status: 'Offline', role: 'Editor', lastActive: 'Yesterday' },
  { name: 'Eve Martinez', status: 'Active', role: 'Admin', lastActive: 'Just now' },
  { name: 'Frank Lee', status: 'Pending', role: 'Viewer', lastActive: '3 days ago' },
];

const statusVariant: Record<string, string> = {
  Active: 'success', Away: 'warning', Offline: 'secondary', Pending: 'default',
};

const BAR_DATA = [
  { day: 'Mon', value: 65 }, { day: 'Tue', value: 80 }, { day: 'Wed', value: 45 },
  { day: 'Thu', value: 90 }, { day: 'Fri', value: 70 }, { day: 'Sat', value: 40 },
  { day: 'Sun', value: 55 },
];

const PROGRESS_DATA = [
  { label: 'Storage', value: 72, color: 'bg-blue-500' },
  { label: 'Memory', value: 45, color: 'bg-green-500' },
  { label: 'CPU', value: 89, color: 'bg-amber-500' },
  { label: 'Network', value: 23, color: 'bg-purple-500' },
];

const ALERTS = [
  { variant: 'info', icon: Info, title: 'Information', msg: 'A new version of AspectOS is available for download.' },
  { variant: 'success', icon: CheckCircle2, title: 'Success', msg: 'Your preferences have been saved successfully.' },
  { variant: 'warning', icon: AlertTriangle, title: 'Warning', msg: 'Storage usage is approaching the 90% threshold.' },
  { variant: 'error', icon: XCircle, title: 'Error', msg: 'Failed to connect to the remote server. Please try again.' },
];

const TIMELINE = [
  { title: 'Project created', time: '09:12', status: 'done' },
  { title: 'Design review', time: '10:45', status: 'done' },
  { title: 'API integration', time: '12:30', status: 'active' },
  { title: 'QA handoff', time: '14:00', status: 'pending' },
];

const alertStyles: Record<string, { border: string; bg: string; icon: string }> = {
  info: { border: 'border-l-blue-500', bg: 'bg-blue-500/5', icon: 'text-blue-500' },
  success: { border: 'border-l-green-500', bg: 'bg-green-500/5', icon: 'text-green-500' },
  warning: { border: 'border-l-amber-500', bg: 'bg-amber-500/5', icon: 'text-amber-500' },
  error: { border: 'border-l-red-500', bg: 'bg-red-500/5', icon: 'text-red-500' },
};

export function ComponentShowcase() {
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('a');
  const [toggleOn, setToggleOn] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl font-semibold text-foreground mb-1">Component Showcase</h1>
        <p className="text-sm text-muted-foreground">
          A reference library of UI primitives for building AspectOS applications.
        </p>
      </div>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Primary</button>
          <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Secondary</button>
          <button className="border border-border text-foreground hover:bg-muted px-4 py-2 rounded-lg text-sm font-medium transition-colors">Outline</button>
          <button className="text-foreground hover:bg-muted px-4 py-2 rounded-lg text-sm font-medium transition-colors">Ghost</button>
          <button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Delete</button>
          <button disabled className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">Disabled</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md text-xs font-medium transition-colors">Small</button>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Medium</button>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg text-base font-medium transition-colors">Large</button>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>New</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">v1.0.0</Badge>
        </div>
      </Section>

      {/* Dashboard Cards */}
      <Section title="Dashboard Cards">
        <div className="grid grid-cols-2 gap-3">
          {KPI_DATA.map((kpi) => (
            <div key={kpi.label} className="bg-muted/50 border border-border/50 rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
              <div className="text-2xl font-semibold text-foreground mb-1">{kpi.value}</div>
              <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Data Table */}
      <Section title="Data Table">
        <div className="border border-border/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_DATA.map((row, i) => (
                <tr key={row.name} className={`border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="px-4 py-2.5 font-medium text-foreground">{row.name}</td>
                  <td className="px-4 py-2.5"><Badge variant={statusVariant[row.status] ?? 'default'}>{row.status}</Badge></td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.role}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Charts */}
      <Section title="Charts">
        <div className="grid grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
            <div className="text-xs font-medium text-muted-foreground mb-3">Weekly Activity</div>
            <div className="flex items-end justify-between gap-1.5 h-32">
              {BAR_DATA.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary" style={{ height: `${d.value}%` }} />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bars */}
          <div className="bg-muted/30 border border-border/50 rounded-xl p-4 space-y-3">
            <div className="text-xs font-medium text-muted-foreground mb-1">System Resources</div>
            {PROGRESS_DATA.map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="text-foreground font-medium">{d.value}%</span>
                </div>
                <div className="bg-muted rounded-full h-2">
                  <div className={`${d.color} rounded-full h-2 transition-all`} style={{ width: `${d.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Form Controls */}
      <Section title="Form Controls">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-muted border border-border text-foreground placeholder-muted-foreground text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1">Select</label>
              <div className="relative">
                <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}
                  className="w-full bg-muted border border-border text-foreground text-sm rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer focus:border-primary/50">
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1">Textarea</label>
              <textarea rows={3} placeholder="Write something..."
                className="w-full bg-muted border border-border text-foreground placeholder-muted-foreground text-sm rounded-lg px-3 py-2 outline-none resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer" />
              <label className="text-sm text-foreground">Enable notifications</label>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-foreground/70">Priority</label>
              {['Low', 'Medium', 'High'].map((opt, i) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" value={String.fromCharCode(97 + i)}
                    checked={radioValue === String.fromCharCode(97 + i)}
                    onChange={(e) => setRadioValue(e.target.value)}
                    className="w-4 h-4 text-primary accent-primary cursor-pointer" />
                  <span className="text-sm text-foreground">{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground">Dark Mode</span>
              <button role="switch" aria-checked={toggleOn} onClick={() => setToggleOn(!toggleOn)}
                className={`toggle-switch ${toggleOn ? 'active' : ''}`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1">Range: {sliderValue}</label>
              <input type="range" min={0} max={100} value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full accent-primary h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md" />
            </div>
          </div>
        </div>
      </Section>

      {/* Content Cards */}
      <Section title="Content Cards">
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: 'Getting Started', desc: 'Learn how to set up your first AspectOS desktop application.', gradient: 'from-blue-500 to-cyan-400' },
            { title: 'Window Management', desc: 'Drag, resize, minimize, and maximize windows with ease.', gradient: 'from-purple-500 to-pink-400' },
            { title: 'Design System', desc: 'Explore tokens, typography, and glass-morphism utilities.', gradient: 'from-amber-500 to-orange-400' },
          ].map((card) => (
            <div key={card.title} className="bg-muted/30 border border-border/50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-28 bg-gradient-to-br ${card.gradient}`} />
              <div className="p-3">
                <div className="text-sm font-medium text-foreground mb-1">{card.title}</div>
                <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{card.desc}</div>
                <button className="text-xs text-primary font-medium hover:underline">View &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Alerts */}
      <Section title="Alerts &amp; Banners">
        <div className="space-y-2">
          {ALERTS.map((a) => {
            const s = alertStyles[a.variant];
            return (
              <div key={a.variant} className={`flex items-start gap-3 px-4 py-3 rounded-lg border-l-4 ${s.border} ${s.bg}`}>
                <a.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${s.icon}`} />
                <div>
                  <div className="text-sm font-medium text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.msg}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Extra primitives */}
      <Section title="Extra Primitives">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
            <div className="text-xs font-medium text-muted-foreground mb-3">Command Chips</div>
            <div className="flex flex-wrap gap-2">
              {['/new-window', '/open-chat', '/run-checks', '/deploy-preview'].map((cmd) => (
                <button
                  key={cmd}
                  className="px-2.5 py-1 rounded-md border border-border bg-background text-xs text-foreground hover:bg-muted transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
            <div className="text-xs font-medium text-muted-foreground mb-3">Timeline</div>
            <div className="space-y-2">
              {TIMELINE.map((item) => (
                <div key={item.title} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.status === 'done'
                          ? 'bg-green-500'
                          : item.status === 'active'
                            ? 'bg-blue-500'
                            : 'bg-muted-foreground/40'
                      }`}
                    />
                    <span className="text-foreground">{item.title}</span>
                  </div>
                  <span className="text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="h-4" />
    </div>
  );
}
