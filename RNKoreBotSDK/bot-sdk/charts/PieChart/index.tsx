import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { PieChartProps } from '../common/types';

const PieChart: React.FC<PieChartProps> = ({
  data = [],
  radius = 145,
  innerCircleColor = "white",
  innerRadius = 60,
  showText = false,
  donut = false,
  textColor = "white",
  textSize = 12,
  strokeWidth = 2,
  strokeColor = "#fff",
  animationDuration = 500,
}) => {
  if (!data || data.length === 0) {
    return <View style={[styles.container, { width: radius * 2, height: radius * 2 }]} />;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = radius;
  const centerY = radius;
  
  let currentAngle = -Math.PI / 2; // Start from top

  const createArcPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number = 0): string => {
    const x1 = centerX + outerRadius * Math.cos(startAngle);
    const y1 = centerY + outerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(endAngle);
    const y2 = centerY + outerRadius * Math.sin(endAngle);
    
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    if (innerRadius > 0) {
      // Donut chart
      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);
      
      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
    } else {
      // Regular pie chart
      return `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }
  };

  const getTextPosition = (startAngle: number, endAngle: number, radius: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = donut ? (radius + innerRadius) / 2 : radius * 0.7;
    return {
      x: centerX + textRadius * Math.cos(midAngle),
      y: centerY + textRadius * Math.sin(midAngle)
    };
  };

  return (
    <View style={[styles.container, { width: radius * 2, height: radius * 2 }]}>
      <Svg width={radius * 2} height={radius * 2}>
        {data.map((item, index) => {
          const angle = (item.value / total) * 2 * Math.PI;
          const endAngle = currentAngle + angle;
          
          const arcPath = createArcPath(
            currentAngle, 
            endAngle, 
            radius - strokeWidth / 2, 
            donut ? innerRadius : 0
          );

          const textPos = getTextPosition(currentAngle, endAngle, radius);

          const slice = (
            <React.Fragment key={`slice-${index}`}>
              <Path
                d={arcPath}
                fill={item.color}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              {showText && item.text && (
                <SvgText
                  x={textPos.x}
                  y={textPos.y}
                  fontSize={textSize}
                  fill={textColor}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {item.text}
                </SvgText>
              )}
            </React.Fragment>
          );

          currentAngle = endAngle;
          return slice;
        })}

        {/* Inner circle for donut chart */}
        {donut && (
          <Circle
            cx={centerX}
            cy={centerY}
            r={innerRadius}
            fill={innerCircleColor}
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PieChart; 