import React, { useState, useEffect } from 'react';
import { useSignUpEmailPassword } from '@nhost/react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { MailCheck, ArrowRight, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import LogoTejastraX from '../components/LogoTejastraX';
import { nhost } from '../lib/nhost';

// Moved out to keep identity stable and avoid remounting children on each keystroke
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

const Shell = ({ children }) => (
  <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#070b12] dark:to-[#0b1220] text-gray-900 dark:text-slate-100">
    <Toaster />
    <div className="absolute top-4 right-4 z-10">
      <ThemeToggle />
    </div>
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
        {/* Left marketing */}
        <div className="relative p-8 sm:p-10 md:p-12 lg:p-16">
          <div aria-hidden className="pointer-events-none absolute -right-20 top-[-10%] h-[360px] w-[360px] rotate-12 rounded-[40%] bg-cyan-600/15 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -right-36 top-[18%] h-[520px] w-[520px] -rotate-6 rounded-[46%] bg-indigo-600/20 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-24 bottom-[-18%] h-[560px] w-[420px] rotate-[22deg] rounded-[48%] bg-fuchsia-600/10 blur-3xl" />
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
            Create your
            <br className="hidden sm:block" />
            TejastraX account
          </h1>
          <p className="mt-4 max-w-md text-gray-600 dark:text-slate-300/85">
            Join a faster, secure, and beautifully simple AI chat experience.
          </p>
        </div>

        {/* Right content */}
        <div className="relative border-t border-gray-200 dark:border-white/10 md:border-l md:border-t-0">
          <div aria-hidden className="pointer-events-none absolute -top-16 right-[-10%] h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-[-10%] left-[10%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative h-full w-full p-8 sm:p-10 md:p-12 lg:p-16">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);

  const { signUpEmailPassword, isLoading, isError, error } = useSignUpEmailPassword();

  const handleGoogleSignIn = async () => {
    try {
      await nhost.auth.signIn({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` },
      });
    } catch (e) {
      // Typically redirects away; log in case
      console.error(e);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const { isSuccess, needsEmailVerification, error: signUpError } =
        await signUpEmailPassword(email, password, {
          displayName: email.split('@')[0],
        });

      if (isSuccess || needsEmailVerification) {
        setIsSignedUp(true);
      } else if (signUpError) {
        toast.error(signUpError.message || 'An unknown error occurred.');
      }
    } catch (err) {
      toast.error('Something went wrong during signup.');
    }
  };


  // Success screen inside the shell
  if (isSignedUp) {
    return (
      <Shell>
        <div className="mx-auto max-w-md text-center">
          <MailCheck className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-slate-100">Please verify your email</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300/85">
            We have sent a verification link to <strong>{email}</strong>.
            Check your inbox and spam folder to complete your registration.
          </p>
          <div className="mt-6">
            <Link to="/sign-in" className="font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
              Return to Sign In
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // Signup form screen inside the shell
  return (
    <Shell>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300/80">
            Already have an account?{' '}
            <Link to="/sign-in" className="font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
              Sign In
            </Link>
          </p>
        </div>

        {isError && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error?.message || 'An unknown error occurred.'}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d172a]/70 px-4 py-3 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 outline-none transition focus:border-cyan-500/40 dark:focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/30"
              placeholder="Email address"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d172a]/70 px-4 py-3 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 outline-none transition focus:border-cyan-500/40 dark:focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/30"
              placeholder="Password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.99 }}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-400 hover:to-cyan-400"
          >
            <span className="relative z-10">{isLoading ? 'Creating Account…' : 'Create Account'}</span>
            <ArrowRight className={`relative z-10 h-4 w-4 transition-transform ${isLoading ? '' : 'group-hover:translate-x-0.5'}`} />
            <span className="absolute inset-0 -z-0 opacity-0 transition group-hover:opacity-100" style={{ boxShadow: '0 30px 80px -20px rgba(56,189,248,0.35)' }} />
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          <span className="text-xs text-gray-500 dark:text-slate-400">or continue with</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0d172a]/70 px-4 py-3 text-sm font-medium text-gray-900 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-[#0d172a]/80 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303C33.582,31.521,29.167,35,24,35c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.756,5.053,29.613,3,24,3C12.955,3,4,11.955,4,23 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.756,5.053,29.613,3,24,3C16.318,3,9.656,7.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,43c5.11,0,9.787-1.961,13.314-5.178l-6.146-5.196C29.211,34.091,26.715,35,24,35 c-5.137,0-9.542-3.47-11.289-8.268l-6.522,5.025C9.49,39.556,16.227,43,24,43z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.089,3.438-3.716,6.135-6.989,7.521 c0.001-0.001,0.001-0.001,0.002-0.001l6.146,5.196C33.976,41.812,44,35,44,23C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Continue with Google
        </button>
      </div>
    </Shell>
  );
};

export default SignUp;
