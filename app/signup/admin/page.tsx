"use client";

import Link from "next/link";

export default function AdminSignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Admin Registration Unavailable</h1>
        <p className="text-slate-600 mb-6">
          Admin registration form has been disabled.
        </p>
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}
