import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Briefcase,
  Save,
  X,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- Types ---------- */
type UserProfile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joined: string;
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState<UserProfile>({
    name: "Prinka",
    role: "Frontend Developer",
    email: "prinka@gmail.com",
    phone: "+91 9XXXXXXXXX",
    location: "India",
    bio: "Passionate frontend developer working on React & modern UI systems.",
    joined: "August 2024",
  });

  const [draftUser, setDraftUser] = useState<UserProfile>(user);

  /* ---------- Work Tracker ---------- */
  const [dailyWork, setDailyWork] = useState<boolean[]>(Array(30).fill(false));

  const toggleDay = (index: number) => {
    setDailyWork((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

  const completedDays = dailyWork.filter(Boolean).length;

  /* ---------- Graph Data ---------- */
  const weeklyData = [
    { day: "Mon", tasks: 2 },
    { day: "Tue", tasks: 4 },
    { day: "Wed", tasks: 3 },
    { day: "Thu", tasks: 5 },
    { day: "Fri", tasks: 6 },
    { day: "Sat", tasks: 1 },
    { day: "Sun", tasks: 0 },
  ];

  /* ---------- Edit Handlers ---------- */
  const startEdit = () => {
    setDraftUser(user);
    setIsEditing(true);
  };

  const saveProfile = () => {
    setUser(draftUser);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraftUser(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* -------- Profile Card -------- */}
        <section className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0)}
          </div>

          {!isEditing ? (
            <>
              <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
              <p className="text-gray-500">{user.role}</p>

              <button
                onClick={startEdit}
                className="mt-4 flex items-center justify-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
              >
                <Edit size={18} /> Edit Profile
              </button>
            </>
          ) : (
            <div className="mt-4 space-y-3">
              {(
                ["name", "role", "email", "phone", "location"] as const
              ).map((field) => (
                <input
                  key={field}
                  className="w-full border rounded-lg p-2"
                  value={draftUser[field]}
                  onChange={(e) =>
                    setDraftUser({
                      ...draftUser,
                      [field]: e.target.value,
                    })
                  }
                  placeholder={field}
                />
              ))}

              <div className="flex gap-2 justify-center">
                <button
                  onClick={saveProfile}
                  className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1 bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* -------- Right Content -------- */}
        <section className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <textarea
              disabled={!isEditing}
              value={isEditing ? draftUser.bio : user.bio}
              onChange={(e) =>
                setDraftUser({ ...draftUser, bio: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Contact Info */}
          {!isEditing && (
            <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" /> {user.email}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-blue-600" /> {user.phone}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" /> {user.location}
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-600" /> Joined {user.joined}
              </div>
            </div>
          )}

          {/* Productivity Graph */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Weekly Productivity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Tracker */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-3">
              Daily Work Tracker
            </h3>
            <div className="grid grid-cols-10 gap-2">
              {dailyWork.map((done, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  className={`w-8 h-8 rounded-md transition ${
                    done
                      ? "bg-green-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  title={`Day ${idx + 1}`}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle size={18} /> {completedDays} days completed
            </div>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
            <p className="text-sm opacity-90">Consistency matters</p>
            <p className="text-3xl font-bold mt-2">
              🔥 {completedDays} Active Days
            </p>
            <p className="text-sm mt-1 opacity-90">
              Keep working daily to grow your streak
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
