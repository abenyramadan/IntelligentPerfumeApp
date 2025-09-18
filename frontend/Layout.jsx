import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, Sparkles, History, Menu, X, LogOut } from "lucide-react";
import { capitalize } from "./utils/utils";

const navigation = [
  { id: "home", name: "Home", icon: Home, path: "/" },
  { id: "profile", name: "Profile", icon: User, path: "/profile" },
  {
    id: "recommendations",
    name: "AI Recommendations",
    icon: Sparkles,
    path: "/recommendations",
  },
  { id: "history", name: "History", icon: History, path: "/history" },
  {
    id: "questionnaire",
    name: "Questionnaire",
    icon: Sparkles,
    path: "/questionnaire",
  },
];

const Layout = ({ children, onLogout, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-purple-600">ScentAI</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => navigate(item.path)}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  );
                })}
              </div>
            </nav>

            {/* User Info and Logout */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <div className="text-sm text-gray-700">
                  Welcome,{" "}
                  <span className="font-semibold text-purple-600">
                    {capitalize(user.username)}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                onClick={onLogout}
                className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {/* User Info */}
              {user && (
                <div className="px-3 py-2 text-sm text-gray-700 border-b border-gray-200">
                  Welcome,{" "}
                  <span className="font-semibold text-purple-600">
                    {user.username}
                  </span>
                </div>
              )}

              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                );
              })}

              {/* Logout Button */}
              <Button
                variant="outline"
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center space-y-1 h-16 text-xs"
                size="sm"
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="md:hidden h-20"></div>
    </div>
  );
};

export default Layout;
