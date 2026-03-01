import { Sparkles, Plus, LayoutDashboard, CreditCard, LogIn, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const navItems = [
  { label: "+ New Canvas", icon: Plus, to: "/app" },
  { label: "My Diagrams", icon: LayoutDashboard, to: "/app" },
  { label: "Pricing", icon: CreditCard, to: "/" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 border-b border-border flex items-center justify-between px-5 bg-background/80 backdrop-blur-xl z-50 shrink-0"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center glow-brand group-hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 text-brand-foreground" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          GrokCanvas
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-0.5">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all duration-200"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Link
          to="/app"
          className="hidden sm:flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all duration-200"
        >
          <LogIn className="w-3.5 h-3.5" />
          Login
        </Link>
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-surface-overlay transition-colors cursor-pointer">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-1 md:hidden z-50"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
