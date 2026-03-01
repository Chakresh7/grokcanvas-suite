import { Sparkles, Plus, LayoutDashboard, CreditCard, LogIn, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "NEW CANVAS", icon: Plus, to: "/app" },
  { label: "MY DIAGRAMS", icon: LayoutDashboard, to: "/app" },
  { label: "PRICING", icon: CreditCard, to: "/" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-xl z-50 shrink-0"
    >
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center glow-brand">
          <Sparkles className="w-4 h-4 text-brand-foreground" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          GrokCanvas
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all duration-200"
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/app"
          className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all duration-200"
        >
          <LogIn className="w-3.5 h-3.5" />
          LOGIN
        </Link>
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
