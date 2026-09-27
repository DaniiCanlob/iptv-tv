import { ErrorScreen } from './components/feedback/ErrorScreen';
import { LoadingScreen } from './components/feedback/LoadingScreen';
import { TvHome } from './features/home/TvHome';
import { AppUpdateNotice } from './features/updates/AppUpdateNotice';
import { useCatalog } from './hooks/useCatalog';

function AppContent() {
  const { state, retry } = useCatalog();

  if (state.status === 'loading') return <LoadingScreen loaded={state.loaded} total={state.total} />;
  if (state.status === 'error') return <ErrorScreen message={state.message} onRetry={retry} />;
  return <TvHome catalog={state.catalog} />;
}

export default function App() {
  return (
    <>
      <AppContent />
      <AppUpdateNotice />
    </>
  );
}
