import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ErrorPage({ error }: { error: Error | null }) {
  const [stars, setStars] = useState<{ x: number; y: number; size: number }[]>(
    []
  );

  useEffect(() => {
    document.title = "Error - Houston, We Have a Problem";

    // Generate random stars
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-red-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        />
      ))}
      <div className="max-w-md w-full space-y-8 text-center relative z-10">
        <div className="animate-fade-in-down text-white">
          <h1 className="text-6xl font-extrabold flex items-center justify-center gap-4">
            <span>Error</span>
          </h1>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Houston, We Have a Problem!
          </h2>
          <p className="mt-4 text-lg">
            An unexpected error has occurred in our space station.
          </p>
          <p className="mt-2 text-sm text-red-300">
            Error details:{" "}
            {error?.message || error?.toString() || "An unknown error occurred"}
          </p>
        </div>
        <div className="animate-fade-in space-y-4">
          <Link to="/">
            <Button className="w-full sm:w-auto px-6 py-3 text-lg font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200">
              Return to Earth
            </Button>
          </Link>
          <div></div>
        </div>
      </div>
    </div>
  );
}
