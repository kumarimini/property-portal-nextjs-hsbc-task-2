"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto max-w-lg rounded-lg border border-line bg-surface p-8 text-center"
    >
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-dark"
      >
        Try again
      </button>
    </div>
  );
}