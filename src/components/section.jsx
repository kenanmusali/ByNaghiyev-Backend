import React, { useEffect, useRef } from "react";

const Section = ({ children }) => {
  const childRefs = useRef([]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      childRefs.current.forEach((el) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementHeight = rect.height;

        let progress = 0;

        if (rect.bottom <= 0) {
          progress = 1;
        } else if (rect.top >= viewportHeight) {
          progress = 0;
        } else {
          const visibleTop = Math.max(rect.top, 0);
          const visibleBottom = Math.min(rect.bottom, viewportHeight);
          const visibleHeight = visibleBottom - visibleTop;

          progress = 1 - visibleHeight / elementHeight;
          progress = Math.min(Math.max(progress, 0), 1);
        }

        const maxRadius = 1000;
        const scale = 1 - progress * 0.2;
        const radius = progress * maxRadius;
        const opacity = 1 - progress * 0.4;

        el.style.transform = `scale(${scale})`;
        el.style.borderRadius = `${radius}px`;
        el.style.opacity = opacity;
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    update();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [children]);

  return (
    <div className="Section-Group">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          ref={(el) => (childRefs.current[index] = el)}
          style={{
            overflow: "hidden",
            willChange: "transform, border-radius, opacity",
            WebkitFilter: "drop-shadow(2px 10px 15px rgba(0,0,0,0.2))",
            filter: "drop-shadow(2px 10px 15px rgba(0,0,0,0.2))",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default Section;