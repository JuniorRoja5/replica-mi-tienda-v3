import React, { useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImageWithFallback({ src, alt, className, ...props }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset state when src changes
  React.useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`relative w-full h-full bg-white/5 rounded-lg flex items-center justify-center overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-purple-300 animate-spin" />
        </div>
      )}
      
      {error && !loading && (
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
            <ImageIcon className="w-8 h-8 text-red-400/50 mb-1" />
        </div>
      )}

      <motion.img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading || error ? 'opacity-0' : 'opacity-100'}`}
        style={{ display: loading || error ? 'none' : 'block' }}
        {...props}
      />
    </div>
  );
}