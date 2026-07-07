"use client";

import { useState, useEffect, Suspense } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { activateDealer } from "@/actions/activateDealer";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Loader2, Sparkles, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      if (!token) {
        setError("No invite token provided.");
        setLoading(false);
        return;
      }

      try {
        const inviteDoc = await getDoc(doc(db, "invites", token));
        if (inviteDoc.exists()) {
          setInvite(inviteDoc.data());
        } else {
          setError("This invite link is invalid or has already been used.");
        }
      } catch (err) {
        console.error("Error fetching invite:", err);
        setError("Failed to verify invite link.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [token]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setRegistering(true);

    try {
      if (!token) throw new Error("Missing invite token");

      const result = await activateDealer(token, password);
      
      if (!result.success || !result.email) {
        throw new Error(result.error || "Failed to activate account");
      }

      // Sign in with the password the user just set
      await signInWithEmailAndPassword(auth, result.email, password);

      // Redirect to their new portal
      router.push("/dealer");
      
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create account. Please try again.");
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 w-12 h-12 mb-4" />
        <p className="text-slate-400 font-medium">Verifying invite link...</p>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full">
          <Shield className="text-slate-500 w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">Invalid Invite</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <Link href="/partnership" className="text-amber-500 hover:text-amber-400 font-bold">
            Request a new partnership &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center space-x-2 mb-6">
          <span className="text-amber-400 text-3xl">⚡</span>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            CLEAR<span className="text-amber-400">HEADLIGHTS</span>
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Welcome, {invite.dealership}!
        </h2>
        <p className="mt-2 text-slate-400">
          Create a password to activate your Dealership Portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-800">
          
          <div className="mb-6 flex items-center bg-slate-950 border border-slate-800 rounded-lg p-4">
            <CheckCircle2 className="w-8 h-8 text-amber-500 mr-3" />
            <div>
              <p className="text-sm font-bold text-white">{invite.email}</p>
              <p className="text-xs text-slate-500">Verified Partnership Email</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300">Set Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:text-sm transition"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:text-sm transition"
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={registering}
                className="flex w-full justify-center items-center rounded-lg border border-transparent bg-amber-500 py-3.5 px-4 text-sm font-extrabold text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition"
              >
                {registering ? <Loader2 className="animate-spin w-5 h-5" /> : "Activate Dealer Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
