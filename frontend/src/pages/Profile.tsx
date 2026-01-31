import { useEffect, useState } from "react";
import {
  Mail,
  Edit,
  Save,
  X,
  Lock,
  Upload,
  User,
  Shield,
} from "lucide-react";
import api from "../services/api";

/* ---------- Types ---------- */
type UserProfile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joined: string;
  avatar?: string;
};

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [user, setUser] = useState<UserProfile>({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joined: "",
    avatar: "",
  });

  const [draftUser, setDraftUser] = useState(user);

  /* ---------- FETCH PROFILE ---------- */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/users/me");
        const d = res.data;

        const formatted: UserProfile = {
          name: d.name || "",
          role: d.role,
          email: d.email,
          phone: d.phone || "",
          location: d.location || "",
          bio: d.bio || "",
          avatar: d.avatar || "",
          joined: new Date(d.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        };

        setUser(formatted);
        setDraftUser(formatted);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ---------- VALIDATION ---------- */
  const validateProfile = () => {
    if (draftUser.name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return false;
    }

    if (draftUser.phone && !/^\d{10}$/.test(draftUser.phone)) {
      setError("Phone number must be 10 digits");
      return false;
    }

    setError("");
    return true;
  };

  /* ---------- SAVE PROFILE ---------- */
  const saveProfile = async () => {
    if (!validateProfile()) return;

    setSaving(true);
    setSuccess("");

    try {
      await api.put("/users/me", {
        name: draftUser.name,
        phone: draftUser.phone,
        location: draftUser.location,
        bio: draftUser.bio,
        avatar: draftUser.avatar,
      });

      setUser(draftUser);
      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch {
      setError("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- AVATAR ---------- */
  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Avatar must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setDraftUser({ ...draftUser, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <p className="p-10 text-center text-gray-500">Loading profile…</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <main className="max-w-4xl mx-auto space-y-6">

        {/* ================= PROFILE ================= */}
        <section className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={draftUser.avatar || "/avatar.png"}
              className="w-full h-full rounded-full object-cover border"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer">
                <Upload size={16} className="text-white" />
                <input hidden type="file" onChange={handleAvatar} />
              </label>
            )}
          </div>

          {!isEditing ? (
            <>
              <h2 className="mt-4 text-xl font-semibold flex items-center justify-center gap-2">
                <User size={18} /> {user.name}
              </h2>
              <p className="text-gray-500">{user.role}</p>
              <p className="text-sm text-gray-400 mt-1">Joined {user.joined}</p>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl"
              >
                <Edit size={16} /> Edit Profile
              </button>
            </>
          ) : (
            <div className="space-y-3 mt-6">
              {(["name", "phone", "location", "bio"] as const).map((f) => (
                <input
                  key={f}
                  className="w-full border rounded-lg p-2"
                  placeholder={`Enter ${f}`}
                  value={draftUser[f]}
                  onChange={(e) =>
                    setDraftUser({ ...draftUser, [f]: e.target.value })
                  }
                />
              ))}

              <div className="flex gap-3 justify-center">
                <button
                  disabled={saving}
                  onClick={saveProfile}
                  className="bg-green-600 text-white px-5 py-2 rounded-xl"
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={() => {
                    setDraftUser(user);
                    setIsEditing(false);
                  }}
                  className="bg-gray-400 text-white px-5 py-2 rounded-xl"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ================= SECURITY (UI ONLY) ================= */}
        <section className="bg-white rounded-2xl shadow p-6 space-y-4 opacity-70">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield size={18} /> Security (Backend pending)
          </h3>

          <p className="text-sm text-gray-500">
            Email & password change will work once backend routes are added.
          </p>

          <div className="flex items-center gap-2 text-gray-400">
            <Mail size={18} /> Change Email
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <Lock size={18} /> Change Password
          </div>
        </section>

        {(error || success) && (
          <p className={`text-center ${error ? "text-red-600" : "text-green-600"}`}>
            {error || success}
          </p>
        )}
      </main>
    </div>
  );
}
