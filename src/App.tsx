import React from "react";
import { ErrorReasonWidget } from "./widgets/error-reason/ErrorReasonWidget";
import "./App.css";

const App: React.FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-xl">
        <ErrorReasonWidget
          loaderTitle="Подождите, идет анализ..."
          resultTitle="Причина ошибки"
          loadingDurationMs={5000}
        />
      </div>
    </main>
  );
};

export default App;

