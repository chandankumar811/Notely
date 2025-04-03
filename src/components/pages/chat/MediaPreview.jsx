import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

const MediaPreview = ({ src, type, onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevent closing the preview
    try {
      // Fetch the file
      const response = await fetch(src);
      const blob = await response.blob();
      
      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      
      // Set filename based on type
      const filename = `downloaded_media_${new Date().getTime()}${
        type === 'image' ? '.jpg' : 
        type === 'video' ? '.mp4' : 
        '.file'
      }`;
      link.download = filename;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct download if fetch method fails
      window.open(src, '_blank');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-2 right-2 z-60 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Download Button */}
        <button 
          className="absolute top-2 left-2 z-60 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
          onClick={handleDownload}
        >
          <Download size={24} />
        </button>

        {/* Media Rendering */}
        {type === 'image' ? (
          <img 
            src={src} 
            alt="Preview" 
            className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        ) : (
          <video 
            src={src} 
            controls 
            className="max-w-full max-h-full"
          />
        )}
      </div>
    </div>
  );
};

export default MediaPreview;