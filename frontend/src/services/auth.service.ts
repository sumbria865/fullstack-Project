import api from "./api";

/* ---------------- REGISTER ---------------- */
export const register = async (data: {
  name?: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/register", data);

    // ❌ DO NOT SAVE TOKEN ON REGISTER
    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Registration failed"
    };
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/login", data);

    // ✅ SAVE TOKEN ONLY ON LOGIN
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed"
    };
  }
};
