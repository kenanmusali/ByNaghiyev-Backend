// ZoomWrapper.js
import { useEffect, useRef } from "react";

const ZoomWrapper = ({ children }) => {
  const wrapperRef = useRef(null);

  const applyZoom = () => {
    const width = window.innerWidth;
    
    if (wrapperRef.current) {
      if (width >= 0 && width <= 2500) {
        wrapperRef.current.style.zoom = "85%";
      } else {
        wrapperRef.current.style.zoom = "100%";
      }
    }
  };

  useEffect(() => {
    applyZoom();
    window.addEventListener("resize", applyZoom);
    
    return () => {
      window.removeEventListener("resize", applyZoom);
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
};

export default ZoomWrapper;