import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import { Spinner } from '@sk-web-gui/react';

export default function LoaderFullScreen() {
  return (
    <EmptyLayout>
      <main>
        <div className="w-screen max-w-full h-screen max-h-full flex place-items-center place-content-center">
          <Spinner aria-busy="true" size={8} aria-label="Laddar information" />
        </div>
      </main>
    </EmptyLayout>
  );
}
