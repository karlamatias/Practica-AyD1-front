import type { ReactNode } from 'react';


export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-md w-full bg-gradient-to-r from-purple-600 to-indigo-500 shadow-lg rounded-xl p-6 space-y-6">
      {children}
    </div>
  );
}
