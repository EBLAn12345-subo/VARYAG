import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  CloudRain,
  CloudSun,
  Disc3,
  EyeOff,
  Headphones,
  House,
  LoaderCircle,
  Moon,
  RotateCw,
  Shield,
  Sun,
  VenetianMask,
  WandSparkles,
  Compass,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [modes, setModes] = useState({ chameleon: true, concierge: true, stealth: true });
  const [weatherIsRainy, setWeatherIsRainy] = useState(true);
  const [shazamState, setShazamState] = useState<'ready' | 'listening' | 'found'>('ready');
  const [connected, setConnected] = useState({ yandex: false, vk: false });
  const [toast, setToast] = useState('');
  const [selectedLog, setSelectedLog] = useState<{ sender: string; time: string; content: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shazamTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (shazamTimer.current) clearTimeout(shazamTimer.current);
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2100);
  }

  function toggleMode(mode: keyof typeof modes) {
    setModes((current) => ({ ...current, [mode]: !current[mode] }));
    showToast(`Режим "${mode}" переключен`);
  }

  function refreshWeather() {
    setWeatherIsRainy((current) => !current);
    showToast('Погода обновлена');
  }

  function triggerShazam() {
    if (shazamTimer.current) clearTimeout(shazamTimer.current);
    setShazamState('listening');
    shazamTimer.current = setTimeout(() => {
      setShazamState('found');
      showToast('Трек добавлен в плейлист');
    }, 1500);
  }

  function toggleStreaming(service: 'yandex' | 'vk') {
    const willConnect = !connected[service];
    setConnected((current) => ({ ...current, [service]: !current[service] }));
    showToast(willConnect ? 'Аккаунт успешно подключен' : 'Аккаунт отвязан');
  }

  const navItems = [
    { id: 'dashboard', label: 'Пульт', Icon: House },
    { id: 'music', label: 'Музыка', Icon: Headphones },
    { id: 'concierge', label: 'Консьерж', Icon: Compass },
    { id: 'logs', label: 'Архив', Icon: Shield },
  ];

  const modeItems: { id: keyof typeof modes; title: string; description: string; Icon: typeof VenetianMask }[] = [
    { id: 'chameleon', title: 'Хамелеон', description: 'Копирование стиля в чатах', Icon: VenetianMask },
    { id: 'concierge', title: 'Консьерж', description: 'Погода и советы', Icon: CloudSun },
    { id: 'stealth', title: 'Stealth-режим', description: 'Архив стертых сообщений', Icon: EyeOff },
  ];

  return (
    <div className="varyag-app min-h-[100dvh] pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-[#f8f9fa]/85 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#050505]/80 sm:px-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/20 bg-white shadow-sm dark:border-white/20 dark:bg-black">
            <svg viewBox="0 0 100 100" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden="true">
              <path d="M10 50 Q 25 30, 40 50 T 70 50 T 100 50" strokeLinecap="round" />
              <path d="M10 50 Q 25 20, 45 50 T 75 50 T 95 50" strokeLinecap="round" opacity=".6" />
              <path d="M10 50 Q 30 70, 50 50 T 80 50 T 90 50" strokeLinecap="round" opacity=".8" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-[.12em]">VARYAG</h1>
            <p className="text-[11px] opacity-50">AI Core &amp; Concierge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="button-toggle-theme"
            onClick={() => {
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(nextTheme);
              showToast(nextTheme === 'light' ? 'Светлая тема' : 'Темная тема');
            }}
            className="varyag-button flex h-9 w-9 items-center justify-center"
            title="Сменить тему"
            aria-label="Сменить тему"
          >
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <button
            type="button"
            data-testid="button-sync"
            onClick={() => showToast('Система синхронизирована')}
            className="varyag-button flex h-9 w-9 items-center justify-center"
            title="Синхронизация"
            aria-label="Синхронизация"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md space-y-4 px-4 pt-6">
        <p className="px-1 text-[10px] leading-relaxed text-current/40" data-testid="text-demo-notice">
          Демонстрационный интерфейс · статусы и подключения условные
        </p>

        {activeTab === 'dashboard' && (
          <div className="panel-in space-y-4" key="dashboard">
            <section className="varyag-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider opacity-50">Статус ядра</span>
                <span className="flex items-center gap-1.5 rounded-full border border-black/20 px-2.5 py-1 dark:border-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] opacity-80">Активен</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="varyag-card flex min-h-[68px] flex-col justify-center p-4">
                  <div className="mb-1 text-[10px] opacity-50">Модель</div>
                  <div className="text-xs font-medium">Gemini 2.5 Flash</div>
                </div>
                <div className="varyag-card flex min-h-[68px] flex-col justify-center p-4">
                  <div className="mb-1 text-[10px] opacity-50">Связь</div>
                  <div className="text-xs font-medium text-emerald-500">Защищена</div>
                </div>
              </div>
            </section>

            <section className="varyag-card p-6">
              <div className="mb-4 text-xs font-medium uppercase tracking-wider opacity-50">Режимы VARYAG</div>
              <div className="space-y-3">
                {modeItems.map(({ id, title, description, Icon }) => (
                  <div
                    key={id}
                    role="button"
                    tabIndex={0}
                    data-testid={`row-mode-${id}`}
                    onClick={() => toggleMode(id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleMode(id);
                      }
                    }}
                    className="varyag-card mode-row flex cursor-pointer items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="opacity-70" />
                      <div>
                        <div className="text-xs font-medium">{title}</div>
                        <div className="text-[10px] opacity-50">{description}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      data-testid={`input-mode-${id}`}
                      aria-label={title}
                      checked={modes[id]}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleMode(id)}
                      className="varyag-toggle"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="panel-in space-y-4" key="music">
            <section className="varyag-card space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider opacity-50">Радар эфира (Shazam)</span>
                <span className="text-[11px] opacity-60" data-testid="status-shazam">
                  {shazamState === 'ready' ? 'Готов' : shazamState === 'listening' ? 'Слушаем...' : 'Найдено'}
                </span>
              </div>
              <div className="varyag-card flex items-center gap-4 p-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/20 dark:border-white/20 ${shazamState === 'listening' ? 'disc-spin' : ''}`}>
                  <Disc3 size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium" data-testid="text-track-title">
                    {shazamState === 'found' ? 'Midnight City (VARYAG Mix)' : 'Ожидание сигнала...'}
                  </div>
                  <div className="truncate text-[11px] opacity-50" data-testid="text-track-artist">
                    {shazamState === 'found' ? 'M83 • Распознано Shazam' : 'Нажмите кнопку ниже'}
                  </div>
                </div>
              </div>
              <button type="button" data-testid="button-recognize-track" onClick={triggerShazam} className="varyag-button flex w-full items-center justify-center gap-2 py-3.5 text-xs font-medium">
                {shazamState === 'listening' ? <LoaderCircle size={14} className="animate-spin" /> : <WandSparkles size={14} />}
                <span>Распознать трек</span>
              </button>
              <p className="text-[10px] leading-relaxed opacity-40">Демо-распознавание: аудио не записывается и Shazam не подключен.</p>
            </section>

            <section className="varyag-card space-y-3 p-6">
              <span className="text-xs font-medium uppercase tracking-wider opacity-50">Стриминги</span>
              {([
                { id: 'yandex' as const, title: 'Яндекс Музыка', mark: 'Я' },
                { id: 'vk' as const, title: 'VK Музыка', mark: 'VK' },
              ]).map((service) => (
                <div key={service.id} className="varyag-card flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/20 text-xs font-bold dark:border-white/20">{service.mark}</div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium">{service.title}</div>
                      <div className={`text-[10px] ${connected[service.id] ? 'font-medium text-emerald-500' : 'opacity-50'}`} data-testid={`status-${service.id}`}>
                        {connected[service.id] ? 'Подключено (@user) · демо' : 'Не подключено'}
                      </div>
                    </div>
                  </div>
                  <button type="button" data-testid={`button-${connected[service.id] ? 'disconnect' : 'connect'}-${service.id}`} onClick={() => toggleStreaming(service.id)} className="varyag-button shrink-0 px-3.5 py-1.5 text-[11px]">
                    {connected[service.id] ? 'Отвязать' : 'Подключить'}
                  </button>
                </div>
              ))}
              <p className="text-[10px] leading-relaxed opacity-40">Подключения показаны только как демонстрация интерфейса.</p>
            </section>
          </div>
        )}

        {activeTab === 'concierge' && (
          <div className="panel-in space-y-4" key="concierge">
            <section className="varyag-card space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider opacity-50">Погода и консьерж</span>
                <button type="button" data-testid="button-refresh-weather" onClick={refreshWeather} className="varyag-button flex h-7 w-7 items-center justify-center" aria-label="Обновить погоду">
                  <RotateCw size={12} />
                </button>
              </div>
              <div className="varyag-card flex items-center gap-4 p-4">
                <div className="text-2xl">{weatherIsRainy ? <CloudRain size={25} /> : <Sun size={25} />}</div>
                <div>
                  <div className="text-xs font-medium" data-testid="text-weather">{weatherIsRainy ? '+14°C, Дождь' : '+22°C, Ясно'}</div>
                  <div className="text-[10px] opacity-50">Амстердам • VARYAG Network</div>
                </div>
              </div>
              <div className="varyag-card p-4 text-xs leading-relaxed opacity-90" data-testid="text-weather-advice">
                {weatherIsRainy ? 'Совет: После 15:00 ожидаются осадки, рекомендуется захватить зонт.' : 'Совет: Отличная погода для прогулки в парке.'}
              </div>
              <p className="text-[10px] leading-relaxed opacity-40">Погодные данные и советы — демонстрационный пример.</p>
            </section>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="panel-in space-y-4" key="logs">
            <section className="varyag-card space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider opacity-50">Хранилище перехватов</span>
                <span className="text-[10px] opacity-50" data-testid="text-log-count">2 записи</span>
              </div>
              <p className="text-[11px] opacity-60">Сообщения сохраняются без стирания. Нажмите на запись, чтобы изучить полностью.</p>
              <div className="space-y-3">
                <button
                  type="button"
                  data-testid="button-open-log-alex"
                  onClick={() => setSelectedLog({ sender: '@alex_ivanov', time: '19:42', content: '«Слушай, я передумал отправлять те файлы... Лучше созвонимся завтра утром в 10:00 и обсудим всё лично.»' })}
                  className="varyag-card log-row block w-full cursor-pointer p-4 text-left text-xs"
                >
                  <span className="mb-1 flex items-center justify-between opacity-70">
                    <span className="font-medium">@alex_ivanov</span><span className="text-[10px]">19:42</span>
                  </span>
                  <span className="block truncate opacity-90">«Слушай, я передумал отправлять те файлы...»</span>
                </button>
                <button
                  type="button"
                  data-testid="button-open-log-channel"
                  onClick={() => setSelectedLog({ sender: 'Канал "Инсайды"', time: '17:15', content: '[Удаленное фото с документом] Конфиденциальный отчет по проекту VARYAG за Q3. Подпись: Проверить до конца недели.' })}
                  className="varyag-card log-row block w-full cursor-pointer p-4 text-left text-xs"
                >
                  <span className="mb-1 flex items-center justify-between opacity-70">
                    <span className="font-medium">Канал "Инсайды"</span><span className="text-[10px]">17:15</span>
                  </span>
                  <span className="block truncate opacity-90">[Удаленное фото с документом]</span>
                </button>
              </div>
              <p className="text-[10px] leading-relaxed opacity-40">Записи и архивные сообщения приведены для демонстрации.</p>
            </section>
          </div>
        )}
      </main>

      <nav className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 z-40 mx-auto flex max-w-md items-center justify-around rounded-[1.5rem] border border-black/10 bg-[#f8f9fa]/85 p-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#080808]/85" aria-label="Основная навигация">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            data-testid={`button-nav-${id}`}
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 flex-col items-center space-y-1 rounded-xl border border-transparent py-2.5 text-xs font-medium transition-all ${activeTab === id ? 'bg-black/10 dark:bg-white/10' : 'opacity-50 hover:opacity-100'}`}
          >
            <Icon size={15} />
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </nav>

      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          data-testid="dialog-log"
          onClick={(event) => { if (event.target === event.currentTarget) setSelectedLog(null); }}
          onKeyDown={(event) => { if (event.key === 'Escape') setSelectedLog(null); }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="modal-sender" className="varyag-card w-full max-w-sm space-y-4 bg-white p-6 shadow-2xl dark:bg-[#111]">
            <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
              <h2 id="modal-sender" className="text-xs font-semibold uppercase tracking-wider">{selectedLog.sender}</h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] opacity-50">{selectedLog.time}</span>
                <button type="button" aria-label="Закрыть" data-testid="button-dismiss-log" className="rounded-full p-1 opacity-60 hover:opacity-100" onClick={() => setSelectedLog(null)}><X size={14} /></button>
              </div>
            </div>
            <div className="select-all py-2 text-xs leading-relaxed opacity-90">{selectedLog.content}</div>
            <button type="button" data-testid="button-close-log" onClick={() => setSelectedLog(null)} className="varyag-button w-full py-2.5 text-xs font-medium">Закрыть</button>
          </section>
        </div>
      )}

      <div className={`fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] left-1/2 z-[60] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 px-5 py-3 text-xs shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#111]/95 ${toast ? 'toast-visible' : 'pointer-events-none opacity-0'}`} role="status" aria-live="polite" data-testid="status-toast">
        {toast || 'Успешно'}
      </div>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
