// src/components/DemoDataLoader.tsx
// Add this to your App.tsx to auto-load demo data

import { useEffect } from 'react';
import useAppStore from '../store/appStore';

export function DemoDataLoader({ children }: { children: React.ReactNode }) {
  const { loadDemoData, isDemoMode } = useAppStore();

  useEffect(() => {
    if (isDemoMode) {
      loadDemoData();
    }
  }, []);

  return <>{children}</>;
}

// USAGE IN APP.TSX:
// 
// import { DemoDataLoader } from './components/DemoDataLoader';
// 
// function App() {
//   return (
//     <DemoDataLoader>
//       <Router>
//         {/* your routes */}
//       </Router>
//     </DemoDataLoader>
//   );
// }
