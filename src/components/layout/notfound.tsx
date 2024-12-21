import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  const [stars, setStars] = useState<{ x: number; y: number; size: number }[]>(
    []
  );

  useEffect(() => {
    document.title = "404 - Lost in Space";

    // Generate random stars
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 5,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative">
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
          <h1 className="text-9xl font-extrabold">404</h1>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Lost in Space!
          </h2>
          <p className="mt-4 text-lg">
            The page you're looking for has drifted off into the cosmos.
          </p>
        </div>
        <div className="animate-fade-in">
          <Link to="/">
            <Button className="mt-8 w-full sm:w-auto px-6 py-3 text-lg font-medium rounded-full text-blue-900 bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 animate-pulse">
              Take me Home!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
