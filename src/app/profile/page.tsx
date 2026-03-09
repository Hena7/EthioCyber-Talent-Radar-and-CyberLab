"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

const skillOptions = [
  "Cybersecurity",
  "Programming",
  "Networking",
  "Web Security",
  "Cryptography",
  "Penetration Testing",
  "Digital Forensics",
  "Cloud Security",
  "Malware Analysis",
  "Incident Response",
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, registerUser, loginUser } = useApp();
  const [isLogin, setIsLogin] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginError, setLoginError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    age: 20,
    university: "",
    skills: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (currentUser) {
    router.push("/dashboard");
    return null;
  }

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";
    if (form.age < 20 || form.age > 30)
      newErrors.age = "Age must be between 20 and 30";
    if (!form.university.trim()) newErrors.university = "University is required";
    if (form.skills.length === 0)
      newErrors.skills = "Select at least one skill";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    registerUser(form);
    router.push("/dashboard");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginUsername.trim()) {
      setLoginError("Username is required");
      return;
    }
    const success = loginUser(loginUsername);
    if (success) {
      router.push("/dashboard");
    } else {
      setLoginError("User not found. Please register first.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {isLogin ? "Welcome Back" : "Join EthioCyber Radar Lab"}
        </h1>
        <p className="text-gray-400">
          {isLogin
            ? "Log in with your username to continue"
            : "Create your profile and start your cybersecurity journey"}
        </p>
      </div>

      {/* Toggle Login/Register */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              !isLogin
                ? "bg-cyan-500 text-gray-900"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              isLogin
                ? "bg-cyan-500 text-gray-900"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Login
          </button>
        </div>
      </div>

      {isLogin ? (
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Enter your username"
              />
              {loginError && (
                <p className="text-red-400 text-sm mt-1">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Login
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Age (20-30)
              </label>
              <input
                type="number"
                min={20}
                max={30}
                value={form.age}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    age: parseInt(e.target.value) || 20,
                  }))
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              {errors.age && (
                <p className="text-red-400 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            {/* University */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                University
              </label>
              <input
                type="text"
                value={form.university}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, university: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.university}
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                      form.skills.includes(skill)
                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                        : "bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {errors.skills && (
                <p className="text-red-400 text-sm mt-1">{errors.skills}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Create Profile
          </button>
        </form>
      )}
    </div>
  );
}
