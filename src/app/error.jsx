"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // আপনি চাইলে এখানে error লগ করে রাখতে পারেন (যেমন: Sentry তে)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-3xl md:text-4xl font-bold text-error">Something went wrong!</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <button
        onClick={() => reset()}
        className="btn btn-error btn-outline mt-8 px-8 rounded-full"
      >
        Try again
      </button>
    </div>
  );
}