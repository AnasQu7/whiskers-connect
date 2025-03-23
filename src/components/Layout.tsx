
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-12">
        {children}
      </main>
      <footer className="bg-whisker-blue text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-semibold flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-whisker-orange flex items-center justify-center">
                  <span className="font-bold">W</span>
                </span>
                Whisker's Community
              </span>
              <p className="text-white/70 mt-2">Connect and share with your community</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-white/70">© {new Date().getFullYear()} Whisker's Community</p>
              <p className="text-white/50 text-sm mt-1">All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
