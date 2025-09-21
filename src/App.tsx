import * as React from 'react';
import { useState } from 'react';
import Accedi from '@/pages/examples/Accedi';
import Home from '@/pages/examples/Home';
import Manager from '@/pages/examples/Manager';
import Capo from '@/pages/examples/Capo';
import Direzione from '@/pages/examples/Direzione';
import Catalogo from '@/pages/examples/Catalogo';
import Button from '@/components/ui/Button';

const screens = { Home,
  Accedi, Manager, Capo, Direzione, Catalogo
} as const;

export default function App() {
  const [screen, setScreen] = useState<keyof typeof screens>('Home');
  const Screen = screens[screen];
  return (
    <div>
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-25">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-2">
          <strong className="mr-4">CORE v8.4</strong>
          {Object.keys(screens).map((s) => (
            <Button key={s} variant={screen===s as any ? 'primary' : 'outline'} size="sm" onClick={() => setScreen(s as any)}>{s}</Button>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-6xl">
        <Screen />
      </main>
    </div>
  );
}
