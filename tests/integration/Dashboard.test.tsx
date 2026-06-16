// ============================================================
// CarbonTwin AI - Integration Tests: Dashboard
// ============================================================

import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Dashboard } from "@/components/carbon/Dashboard";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import {
  DEMO_EMISSION_SOURCES,
  DEMO_MONTHLY_SUMMARIES,
  DEMO_ACTIONS,
  DEMO_PROFILE,
} from "@/lib/carbon/demoData";
import { calculateByCategory, calculateTotalEmissions } from "@/lib/carbon/carbonCalculations";

// Mock recharts to avoid canvas rendering errors in test env
vi.mock("recharts", () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => null,
  Cell: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

const mockStore: CarbonStore = {
  state: {
    profile: DEMO_PROFILE,
    entries: [],
    actions: DEMO_ACTIONS,
    monthlySummaries: DEMO_MONTHLY_SUMMARIES,
    lastUpdated: new Date().toISOString(),
  },
  profile: DEMO_PROFILE,
  entries: [],
  actions: DEMO_ACTIONS,
  monthlySummaries: DEMO_MONTHLY_SUMMARIES,
  emissionSources: DEMO_EMISSION_SOURCES,
  totalEmissions: calculateTotalEmissions(DEMO_EMISSION_SOURCES),
  emissionsByCategory: calculateByCategory(DEMO_EMISSION_SOURCES),
  carbonDNA: "transport-heavy",
  currentMonthEntries: [],
  actionsByStatus: {
    pending: DEMO_ACTIONS.filter((a) => a.status === "pending"),
    inProgress: DEMO_ACTIONS.filter((a) => a.status === "in-progress"),
    completed: DEMO_ACTIONS.filter((a) => a.status === "completed"),
  },
  potentialMonthlySavings: 338,
  addEntry: vi.fn(),
  updateActionStatus: vi.fn(),
  quickLog: vi.fn(),
  resetToDemo: vi.fn(),
};

describe("Dashboard", () => {
  it("renders the main heading", () => {
    render(<Dashboard store={mockStore} />);
    expect(screen.getByRole("heading", { name: /your carbon footprint/i })).toBeInTheDocument();
  });

  it("renders all four stat cards", () => {
    render(<Dashboard store={mockStore} />);
    expect(screen.getByText(/monthly emissions/i)).toBeInTheDocument();
    expect(screen.getByText(/paris target/i)).toBeInTheDocument();
    expect(screen.getByText(/uk average/i)).toBeInTheDocument();
    expect(screen.getByText(/trees to offset/i)).toBeInTheDocument();
  });

  it("displays total emissions value", () => {
    render(<Dashboard store={mockStore} />);
    // Total should be in the document
    expect(screen.getByText(/687/)).toBeInTheDocument();
  });

  it("renders the trend chart section", () => {
    render(<Dashboard store={mockStore} />);
    expect(screen.getByText(/6-month emission trend/i)).toBeInTheDocument();
  });

  it("renders the category breakdown section", () => {
    render(<Dashboard store={mockStore} />);
    expect(screen.getByText(/category breakdown/i)).toBeInTheDocument();
  });

  it("renders carbon leak detection", () => {
    render(<Dashboard store={mockStore} />);
    expect(screen.getByText(/carbon leak detection/i)).toBeInTheDocument();
  });

  it("shows top emission sources", () => {
    render(<Dashboard store={mockStore} />);
    // Should show rank numbers
    expect(screen.getByLabelText(/rank 1/i)).toBeInTheDocument();
  });

  it("shows progress bars for emission sources", () => {
    render(<Dashboard store={mockStore} />);
    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it("has proper ARIA landmark for stat region", () => {
    render(<Dashboard store={mockStore} />);
    expect(screen.getByRole("region", { name: /key emission statistics/i })).toBeInTheDocument();
  });

  it("renders charts with correct test IDs", () => {
    render(<Dashboard store={mockStore} />);
    const containers = screen.getAllByTestId("responsive-container");
    expect(containers.length).toBeGreaterThanOrEqual(2);
  });

  it("pie chart section has accessible list", () => {
    render(<Dashboard store={mockStore} />);
    const breakdownSection = screen.getByLabelText(/emission amounts by category/i);
    const listItems = within(breakdownSection).getAllByRole("listitem");
    expect(listItems.length).toBe(4); // transport, energy, diet, consumption
  });

  it("shows category names in pie breakdown", () => {
    render(<Dashboard store={mockStore} />);
    expect(screen.getByText("Transport")).toBeInTheDocument();
    expect(screen.getByText("Energy")).toBeInTheDocument();
    expect(screen.getByText("Diet")).toBeInTheDocument();
    expect(screen.getByText("Consumption")).toBeInTheDocument();
  });

  it("section has correct ID for navigation", () => {
    render(<Dashboard store={mockStore} />);
    const section = document.getElementById("dashboard");
    expect(section).not.toBeNull();
  });

  it("shows Paris Agreement info when over target", () => {
    render(<Dashboard store={mockStore} />);
    // 687 kg > 208 kg target, so should show over
    expect(screen.getByText(/over/i)).toBeInTheDocument();
  });
});
