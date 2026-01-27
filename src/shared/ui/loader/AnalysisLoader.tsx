import React from "react";

type AnalysisLoaderProps = {
  title?: string;
};

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ title }) => {
  const displayedTitle = title ?? "Подождите, идет анализ...";

  return (
    <div
      className="flex min-h-[200px] w-full items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500"
          aria-hidden="true"
        />
        <h2 className="text-center text-lg font-semibold text-gray-900">
          {displayedTitle}
        </h2>
        <p className="text-center text-sm text-gray-500">
          Это может занять несколько секунд.
        </p>
      </div>
    </div>
  );
};

