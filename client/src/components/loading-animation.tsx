import { useState, useEffect } from "react";

interface LoadingAnimationProps {
  isVisible: boolean;
}

export default function LoadingAnimation({ isVisible }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            AI Agent is Analyzing...
          </h3>
          <p className="text-sm text-gray-600">
            Processing your use case with advanced AI algorithms
          </p>
        </div>

        {/* Wall-E Style Robot Animation */}
        <div className="relative h-20 mb-6 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out"
            style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center animate-bounce">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse ml-1"></div>
              </div>
            </div>
            {/* Trail effect */}
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-transparent to-blue-400 opacity-60"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">{Math.round(progress)}%</span> Complete
        </div>

        {/* Status Messages */}
        <div className="mt-4 text-xs text-gray-500">
          {progress < 30 && "Initializing AI agents..."}
          {progress >= 30 && progress < 60 && "Analyzing use case requirements..."}
          {progress >= 60 && progress < 90 && "Calculating cost optimizations..."}
          {progress >= 90 && "Finalizing recommendations..."}
        </div>
      </div>
    </div>
  );
}