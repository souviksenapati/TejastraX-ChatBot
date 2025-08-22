import React, { useState, useEffect } from 'react';
import { useSignInEmailPassword } from '@nhost/react';
import { Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import LogoTejastraX from '../components/LogoTejastraX';

// Local Theme Toggle (moved out of component to avoid subtree remounts during input updates)
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-md text-gray-500 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-accent hover:text-gray-800 dark:hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInEmailPassword, isLoading, isSuccess, isError, error } = useSignInEmailPassword();

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signInEmailPassword(email, password);
  };

  if (isSuccess) return <Navigate to="/" replace />;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#070b12] dark:to-[#0b1220] text-gray-900 dark:text-slate-100">
      <Toaster />
  <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* subtle scene grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '42px 42px'
        }}
      />

  <div className="relative mx-auto my-10 w-full max-w-6xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#0a1323]/60 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5">
        <div className="relative grid grid-cols-1 overflow-hidden rounded-3xl md:grid-cols-2">
          {/* LEFT: brand + story with organic shapes */}
          <div className="relative p-8 sm:p-10 md:p-12 lg:p-16">
            {/* layered ribbons */}
            <div aria-hidden className="pointer-events-none absolute -right-20 top-[-10%] h-[360px] w-[360px] rotate-12 rounded-[40%] bg-cyan-600/15 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -right-36 top-[18%] h-[520px] w-[520px] -rotate-6 rounded-[46%] bg-indigo-600/20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -right-24 bottom-[-18%] h-[560px] w-[420px] rotate-[22deg] rounded-[48%] bg-fuchsia-600/10 blur-3xl" />

            {/* wave svg */}
            <svg className="pointer-events-none absolute inset-x-0 bottom-[-12%] -z-10 h-[180px] w-full" viewBox="0 0 1440 200" fill="none">
              <path d="M0 120 C 240 60, 480 180, 720 120 C 960 60, 1200 160, 1440 100 L 1440 200 L 0 200 Z" fill="url(#g)" opacity="0.25" />
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>

            <div className="mb-10 flex items-center gap-3">
              <div className="rounded-lg p-2.5 ring-1 shadow-sm bg-white/80 ring-gray-900/10 dark:bg-slate-900/80 dark:ring-white/10">
                <LogoTejastraX className="h-9" />
              </div>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Welcome back to
              <br className="hidden sm:block" />
              TejastraX
            </h1>
            <p className="mt-4 max-w-md text-gray-600 dark:text-slate-300/85">
              Sign in to your AI chat — fast, secure, and beautifully simple.
            </p>
          </div>

          {/* RIGHT: form with dark glass panel */}
          <div className="relative border-t border-gray-200 dark:border-white/10 md:border-l md:border-t-0">
            {/* radial glow */}
            <div aria-hidden className="pointer-events-none absolute -top-16 right-[-10%] h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute bottom-[-10%] left-[10%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative h-full w-full p-8 sm:p-10 md:p-12 lg:p-16">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold">Sign In</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-300/80">
                  New here?{' '}
                  <Link to="/sign-up" className="font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
                    Create Account
                  </Link>
                </p>
              </div>

              {isError && (
                <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error?.message || 'An unknown error occurred.'}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email address"
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d172a]/70 px-4 py-3 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 outline-none transition focus:border-cyan-500/40 dark:focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/30"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d172a]/70 px-4 py-3 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 outline-none transition focus:border-cyan-500/40 dark:focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/30"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-400 hover:to-cyan-400"
                >
                  <span className="relative z-10">{isLoading ? 'Signing in…' : 'Sign In'}</span>
                  <ArrowRight className={`relative z-10 h-4 w-4 transition-transform ${isLoading ? '' : 'group-hover:translate-x-0.5'}`} />
                  <span className="absolute inset-0 -z-0 opacity-0 transition group-hover:opacity-100" style={{ boxShadow: '0 30px 80px -20px rgba(56,189,248,0.35)' }} />
                </motion.button>

                <p className="pt-1 text-center text-sm text-gray-600 dark:text-slate-300/80">
                  Forgot your password?{' '}
                  <a href="#" className="font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
                    Reset it
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
