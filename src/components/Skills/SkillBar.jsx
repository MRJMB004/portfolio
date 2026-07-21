import { useEffect, useState } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

export default function SkillBar({ name, level }) {
  const [ref, isVisible] = useScrollAnimation();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setWidth(level), 150);
      return () => clearTimeout(t);
    }
  }, [isVisible, level]);

  return (
    <div ref={ref} className="mb-4 last:mb-0">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium">{name}</span>
        <span className="text-ink-muted font-mono">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-brand transition-all duration-[1400ms] ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
