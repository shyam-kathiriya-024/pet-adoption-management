import { useState } from "react";
import { LogOut, Menu, PawPrint } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        location.pathname === to ? "text-primary font-bold" : "text-muted-foreground"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout.mutate();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <span className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground tracking-tight">
                Paw<span className="text-primary">Friends</span>
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/pets">Adopt a Pet</NavLink>
            {user?.user_role === "admin" && <NavLink to="/admin">Admin Dashboard</NavLink>}
            {user?.user_role === "user" && <NavLink to="/dashboard">My Applications</NavLink>}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative bg-secondary h-8 w-8 rounded-full">
                    <div className="h-9 w-9 flex items-center justify-center text-secondary-foreground font-bold">
                      {user.user_name[0]}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.user_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.user_email}</p>
                  </div>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-6">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <a className="text-lg font-medium">Home</a>
                </Link>
                <Link to="/pets" onClick={() => setIsOpen(false)}>
                  <a className="text-lg font-medium">Adopt a Pet</a>
                </Link>
                {user?.user_role === "admin" && (
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <a className="text-lg font-medium">Admin Dashboard</a>
                  </Link>
                )}
                {user?.user_role === "user" && (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <a className="text-lg font-medium">My Applications</a>
                  </Link>
                )}

                <div className="h-px bg-border my-2" />

                {user ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="h-6 w-6 text-primary" />
                <span className="text-xl font-heading font-bold">PawFriends</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting loving families with pets in need since 2024. Find your new best friend today.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/pets">Find a Dog</Link>
                </li>
                <li>
                  <Link to="/pets">Find a Cat</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                123 Puppy Lane
                <br />
                New York, NY 10012
                <br />
                hello@pawfriends.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 PawFriends. All rights reserved. Mockup Design.
          </div>
        </div>
      </footer>
    </div>
  );
}
