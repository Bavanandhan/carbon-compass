// ============================================================
// CarbonTwin AI - Navigation Header
// ============================================================



import { useState } from "react";
import { clsx } from "clsx";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊", href: "#dashboard" },
  { id: "simulator", label: "Simulator", icon: "🔮", href: "#simulator" },
  { id: "actions", label: "Actions", icon: "✅", href: "#actions" },
  { id: "profile", label: "Carbon DNA", icon: "🧬", href: "#profile" },
  { id: "coach", label: "AI Coach", icon: "🤖", href: "#coach" },
];

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userData.user.id)
        .maybeSingle();
      return data ?? { display_name: userData.user.email ?? "Explorer", avatar_url: null };
    },
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-carbon-200 bg-white/95 backdrop-blur"
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
            aria-label="CarbonTwin AI — Home"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600 text-sm font-bold text-white"
              aria-hidden="true"
            >
              CT
            </span>
            <span className="font-display text-lg font-bold text-carbon-900">
              CarbonTwin <span className="text-forest-600">AI</span>
            </span>
          </a>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:block"
          >
            <ul
              className="flex items-center gap-1"
              role="list"
            >
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={clsx(
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
                      activeSection === item.id
                        ? "bg-forest-50 text-forest-700"
                        : "text-carbon-600 hover:bg-carbon-100 hover:text-carbon-900",
                    )}
                    aria-current={activeSection === item.id ? "page" : undefined}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account actions (desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            {profile?.display_name && (
              <span className="text-sm text-carbon-600" aria-label="Signed in as">
                {profile.display_name}
              </span>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-carbon-200 px-3 py-1.5 text-sm font-medium text-carbon-700 transition hover:bg-carbon-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
            >
              Sign out
            </button>
          </div>


          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-carbon-600 hover:bg-carbon-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        className={clsx(
          "border-t border-carbon-200 bg-white md:hidden",
          mobileMenuOpen ? "block" : "hidden",
        )}
      >
        <ul
          className="space-y-1 p-4"
          role="list"
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
                  activeSection === item.id
                    ? "bg-forest-50 text-forest-700"
                    : "text-carbon-600 hover:bg-carbon-100",
                )}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignOut();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-carbon-600 hover:bg-carbon-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
            >
              <span aria-hidden="true">🚪</span>
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
