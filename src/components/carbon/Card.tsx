// ============================================================
// CarbonTwin AI - Card Component
// ============================================================

import { type ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Card({
  children,
  className,
  as: Tag = "div",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: CardProps) {
  return (
    <Tag
      className={clsx(
        "rounded-2xl border border-carbon-200 bg-white p-6 shadow-sm",
        className,
      )}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </Tag>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  id?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, id, action }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2
          id={id}
          className="text-lg font-semibold text-carbon-900"
        >
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-sm text-carbon-600">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: number; label: string };
  color?: "default" | "green" | "amber" | "red";
  icon?: ReactNode;
}

export function StatCard({ label, value, sub, trend, color = "default", icon }: StatCardProps) {
  const colorClasses = {
    default: "text-carbon-900",
    green: "text-forest-600",
    amber: "text-amber-600",
    red: "text-red-500",
  };

  const trendColor =
    trend && trend.value < 0 ? "text-forest-600" : trend && trend.value > 0 ? "text-red-500" : "";

  return (
    <Card as="article">
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className="mt-0.5 flex-shrink-0 text-2xl"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-carbon-500">{label}</p>
          <p className={clsx("mt-1 text-2xl font-bold", colorClasses[color])}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-carbon-400">{sub}</p>}
          {trend && (
            <p className={clsx("mt-1 text-xs font-medium", trendColor)}>
              {trend.value > 0 ? "▲" : "▼"} {Math.abs(trend.value).toFixed(1)}%{" "}
              <span className="text-carbon-400">{trend.label}</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
