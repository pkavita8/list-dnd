import React, { useEffect } from "react";

const Modal = ({ url, close }: { url: string; close: VoidFunction }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            close();
          }
        };
    
        // Add event listener
        window.addEventListener('keydown', handleKeyDown);
    
        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [close]);

  return (
    <div className="fixed w-full h-full flex items-center justify-center bg-black/60 top-0">
      <button
        onClick={() => close()}
        className="text-xxl w-10 h-10 rounded-md absolute right-2 top-2 bg-white text-black"
      >
        X
      </button>
      <div className="max-w-[40em]">
        <img src={url} alt={""} className="w-full" />
      </div>
    </div>
  );
};

export default Modal;
