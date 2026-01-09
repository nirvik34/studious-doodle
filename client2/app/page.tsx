import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainScanHero } from "@/components/shared/BrainScanHero";
import { ArrowRight, ShieldCheck, Activity, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Activity className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-lg font-bold text-blue-900">StrokeRisk AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/signup">
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-blue-900">
                    Early Stroke Detection Saves Lives
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Use our medical-grade AI to analyze facial asymmetry and risk factors in just 30 seconds. Fast, accurate, and accessible.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Existing User
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <BrainScanHero />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">AI Analysis</h2>
                <p className="text-center text-gray-500">
                  Advanced algorithms detect subtle facial drooping and asymmetry invisible to the naked eye.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">Hospital Finder</h2>
                <p className="text-center text-gray-500">
                  Instantly locate the nearest Primary Stroke Centers with real-time navigation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">Medical Grade</h2>
                <p className="text-center text-gray-500">
                  Developed with neurologists to ensure accuracy and reliability.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 StrokeRisk AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
