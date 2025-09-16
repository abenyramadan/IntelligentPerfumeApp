import React, { useState, useEffect } from "react";
import {
  Users,
  BarChart,
  ListChecks,
  FlaskConical,
  Sparkles,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import UsersTable from "../dashboard/UsersTable";
import QuestionnairesTable from "../dashboard/QuestionnairesTable";
import ResponsesTable from "../dashboard/ResponsesTable";
import UserProfilesTable from "../dashboard/UserProfilesTable";
import RecommendationsTable from "../dashboard/RecommendationsTable";
import PerfumesTable from "../dashboard/PerfumesTable";

// Fixed chart imports
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// --- Sidebar Links ---
const sidebarLinks = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: "analytics", label: "Analytics", icon: <BarChart className="w-5 h-5" /> },
  { key: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
  { key: "questionnaires", label: "Questionnaires", icon: <ListChecks className="w-5 h-5" /> },
  { key: "responses", label: "Responses", icon: <ListChecks className="w-5 h-5" /> },
  { key: "profiles", label: "User Profiles", icon: <Users className="w-5 h-5" /> },
  { key: "perfumes", label: "Perfume Matches", icon: <FlaskConical className="w-5 h-5" /> },
  { key: "recommendations", label: "Recommendations", icon: <Sparkles className="w-5 h-5" /> },
  { key: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

const Dashboard: React.FC = () => {
  const [active, setActive] = useState("dashboard");
  const [users, setUsers] = useState<any[]>([]);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    users: true,
    questionnaires: true,
    recommendations: true,
    perfumes: true
  });

  // Fetch data
  useEffect(() => {
    // Fetch users
    fetch("http://127.0.0.1:8000/users/")
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data.data) ? data.data : []);
        setLoading(prev => ({ ...prev, users: false }));
      })
      .catch(() => setLoading(prev => ({ ...prev, users: false })));

    // Fetch questionnaires
    fetch("http://127.0.0.1:8000/questionnaires/responses/")
      .then((res) => res.json())
      .then((data) => {
        setQuestionnaires(Array.isArray(data.data) ? data.data : []);
        setLoading(prev => ({ ...prev, questionnaires: false }));
      })
      .catch(() => setLoading(prev => ({ ...prev, questionnaires: false })));

    // Fetch recommendations
    fetch("http://127.0.0.1:8000/recommendations/")
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(Array.isArray(data.data) ? data.data : []);
        setLoading(prev => ({ ...prev, recommendations: false }));
      })
      .catch(() => setLoading(prev => ({ ...prev, recommendations: false })));

    // Fetch perfumes
    fetch("http://127.0.0.1:8000/perfumes/")
      .then((res) => res.json())
      .then((data) => {
        setPerfumes(Array.isArray(data.data) ? data.data : []);
        setLoading(prev => ({ ...prev, perfumes: false }));
      })
      .catch(() => setLoading(prev => ({ ...prev, perfumes: false })));
  }, []);

  // --- Summary cards ---
  const summaryCards = [
    { 
      label: "Total Users", 
      value: users.length, 
      icon: <Users className="w-6 h-6 text-purple-500" />,
      loading: loading.users
    },
    { 
      label: "Questionnaires Completed", 
      value: questionnaires.length, 
      icon: <ListChecks className="w-6 h-6 text-pink-500" />,
      loading: loading.questionnaires
    },
    { 
      label: "Recommendations Generated", 
      value: recommendations.length, 
      icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
      loading: loading.recommendations
    },
    { 
      label: "Active Perfumes", 
      value: perfumes.length, 
      icon: <FlaskConical className="w-6 h-6 text-blue-500" />,
      loading: loading.perfumes
    },
  ];

  // --- Chart Data ---
  const userGrowthData = {
    labels: Object.keys(
      users.reduce((acc, user) => {
        if (user.createdAt) {
          const date = new Date(user.createdAt);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number })
    ).sort(),
    datasets: [
      {
        label: "New Users",
        data: Object.values(
          users.reduce((acc, user) => {
            if (user.createdAt) {
              const date = new Date(user.createdAt);
              const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
              acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
          }, {} as { [key: string]: number })
        ),
        fill: true,
        backgroundColor: "rgba(168,85,247,0.2)",
        borderColor: "#a855f7",
        tension: 0.4,
      },
    ],
  };

  const skinTypes = ["Oily", "Dry", "Balanced", "Combination"];
  const skinPieData = {
    labels: skinTypes,
    datasets: [
      { 
        data: skinTypes.map(
          type => questionnaires.filter(q => 
            q.answer && q.answer.toLowerCase().includes(type.toLowerCase())
          ).length
        ), 
        backgroundColor: ["#f472b6", "#fbbf24", "#34d399", "#a5b4fc"],
        hoverOffset: 4
      },
    ],
  };

  const noteCounts = perfumes.reduce((acc, perfume) => {
    if (perfume.notes) {
      perfume.notes.split(",").forEach((note: string) => {
        const trimmedNote = note.trim();
        if (trimmedNote) {
          acc[trimmedNote] = (acc[trimmedNote] || 0) + 1;
        }
      });
    }
    return acc;
  }, {} as { [key: string]: number });

  const noteBarData = {
    labels: Object.keys(noteCounts),
    datasets: [
      {
        label: "Perfume Notes",
        data: Object.values(noteCounts),
        backgroundColor: "#a5b4fc",
        borderRadius: 6,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-purple-100 shadow-lg flex flex-col py-8 px-4">
        <div className="mb-10 text-center">
          <span className="text-2xl font-extrabold text-purple-700 tracking-tight">ScentAI</span>
        </div>
        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => setActive(link.key)}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition font-semibold
                ${active === link.key
                  ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow"
                  : "text-purple-700 hover:bg-purple-100"}`}
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Dashboard Overview */}
        {active === "dashboard" && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {summaryCards.map((card) => (
                <div key={card.label} className="bg-white/90 rounded-2xl shadow-lg p-6 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-50">{card.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-purple-700">
                      {card.loading ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        card.value.toLocaleString()
                      )}
                    </div>
                    <div className="text-gray-500 text-sm">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* User Growth Chart */}
              <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <div className="font-semibold text-purple-700 mb-4">User Growth</div>
                <div className="h-64">
                  {userGrowthData.labels.length > 0 ? (
                    <Chart type="line" data={userGrowthData} options={chartOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No user data available
                    </div>
                  )}
                </div>
              </div>

              {/* Skin Chemistry Distribution */}
              <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <div className="font-semibold text-purple-700 mb-4">Skin Chemistry Distribution</div>
                <div className="h-64">
                  {questionnaires.length > 0 ? (
                    <Chart type="pie" data={skinPieData} options={chartOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No questionnaire data
                    </div>
                  )}
                </div>
              </div>

              {/* Popular Fragrance Notes */}
              <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <div className="font-semibold text-purple-700 mb-4">Popular Fragrance Notes</div>
                <div className="h-64">
                  {Object.keys(noteCounts).length > 0 ? (
                    <Chart type="bar" data={noteBarData} options={chartOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No perfume data
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tables */}
        {active === "users" && <UsersTable />}
        {active === "questionnaires" && <QuestionnairesTable />}
        {active === "responses" && <ResponsesTable />}
        {active === "profiles" && <UserProfilesTable />}
        {active === "recommendations" && <RecommendationsTable />}
        {active === "perfumes" && <PerfumesTable />}
        
        {/* Placeholder for other sections */}
        {active === "analytics" && (
          <div className="bg-white/90 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Analytics</h2>
            <p className="text-gray-600">Advanced analytics features coming soon...</p>
          </div>
        )}
        
        {active === "settings" && (
          <div className="bg-white/90 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel will be implemented here...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;