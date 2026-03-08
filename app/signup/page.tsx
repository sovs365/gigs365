"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm">
            Back to home
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">Task Hive</span>
            <h1 className="text-4xl font-bold text-slate-900">Task Hive</h1>
          </div>
          <p className="text-slate-600 text-center mb-12 text-lg">
            Join the hive and start collaborating
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="border border-slate-200 rounded-lg p-8 hover:border-amber-400 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">Freelancer</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Freelancer</h2>
              <p className="text-slate-600 mb-6">
                Complete gigs, build your skills, and earn money by offering your services.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-slate-600">
                <li>Browse available gigs</li>
                <li>Showcase your portfolio</li>
                <li>Earn competitive rates</li>
                <li>Build your reputation</li>
              </ul>
              <Link href="/signup/freelancer" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up as Freelancer
                </Button>
              </Link>
            </div>

            <div className="border border-slate-200 rounded-lg p-8 hover:border-amber-400 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">Client</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Client</h2>
              <p className="text-slate-600 mb-6">
                Post gigs and projects, find talented freelancers, and grow your business.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-slate-600">
                <li>Post unlimited gigs</li>
                <li>Access skilled talent pool</li>
                <li>Manage projects easily</li>
                <li>Scale your team</li>
              </ul>
              <Link href="/signup/client" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Sign Up as Client
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
