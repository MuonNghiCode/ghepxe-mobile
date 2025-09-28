import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import Svg, {
  Defs,
  Stop,
  Circle,
  Filter,
  FeGaussianBlur,
  Ellipse,
  RadialGradient,
} from "react-native-svg";

const { width } = Dimensions.get("window");

interface ParticleBackgroundProps {
  count?: number;
  height?: number;
}

const COLORS = ["green-gradient", "blue-gradient"];

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 10,
  height = 1500,
}) => {
  // Sinh thông tin particle cố định một lần duy nhất
  const particleData = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = 220 + Math.random() * 180;
      const margin = 24;
      const isLeft = i % 2 === 0;
      const x = isLeft ? margin : width - margin;
      const y = ((i + 0.5) / count) * height * 1.2 + Math.random() * 60 - 30;
      const rotation = Math.random() * 360;
      const colorIdx = COLORS[Math.floor(Math.random() * COLORS.length)];
      const isEllipse = i % 3 === 0;
      return { isEllipse, x, y, size, rotation, colorIdx };
    });
  }, [count, height, width]);

  return (
    <Svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0,
      }}
    >
      <Defs>
        <Filter id="superBlur" x="-100%" y="-100%" width="300%" height="300%">
          <FeGaussianBlur stdDeviation="160" />
        </Filter>
        <RadialGradient id="green-gradient" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#00A982" stopOpacity="0.7" />
          <Stop offset="100%" stopColor="#00A982" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="blue-gradient" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#00BBFF" stopOpacity="0.7" />
          <Stop offset="100%" stopColor="#00BBFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {particleData.map((p, i) =>
        p.isEllipse ? (
          <Ellipse
            key={`ellipse-${i}`}
            cx={p.x}
            cy={p.y}
            rx={p.size / 2}
            ry={p.size / 2.2}
            fill={`url(#${p.colorIdx})`}
            filter="url(#superBlur)"
            transform={`rotate(${p.rotation} ${p.x} ${p.y})`}
          />
        ) : (
          <Circle
            key={`circle-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.size / 2}
            fill={`url(#${p.colorIdx})`}
            filter="url(#superBlur)"
          />
        )
      )}
    </Svg>
  );
};

export default ParticleBackground;
