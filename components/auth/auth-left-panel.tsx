import { Workflow, Share2, FileText } from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-surface px-16 py-12 border-r border-surface-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-brand shrink-0" />
        <span className="text-lg font-semibold text-copy-primary tracking-tight">Ghost AI</span>
      </div>

      {/* Headline + features */}
      <div>
        <h1 className="text-4xl font-bold text-copy-primary leading-tight">
          Design systems at the<br />speed of thought.
        </h1>
        <p className="mt-4 text-copy-muted text-sm leading-relaxed max-w-sm">
          Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
        </p>
        <ul className="mt-10 space-y-5">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-copy-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-copy-primary">{title}</p>
                <p className="text-xs text-copy-muted mt-0.5 leading-relaxed">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <p className="text-xs text-copy-faint">© 2026 Ghost AI. All rights reserved.</p>
    </div>
  );
}
