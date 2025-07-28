import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { BarChartProps } from '../common/types';
import { scaleValue, getMaxValue, getWindowWidth, convertTextStyleToSvg } from '../common/utils';

const BarChart: React.FC<BarChartProps> = ({
  width = getWindowWidth() - 115,
  height = 220,
  data = [],
  stackData = null,
  barWidth = 50,
  horizontal = false,
  noOfSections = 4,
  initialSpacing = 10,
  yAxisThickness = 1,
  yAxisColor = "#ccc",
  xAxisLabelTextStyle = {},
  spacing = 30,
}) => {
  if ((!data || data.length === 0) && (!stackData || stackData.length === 0)) {
    return <View style={[styles.container, { width, height }]} />;
  }

  const chartData = stackData || data;
  const maxValue = stackData 
    ? Math.max(...stackData.map(item => 
        item.stacks.reduce((sum: number, stack: any) => sum + stack.value, 0)
      ))
    : getMaxValue(data);

  const chartWidth = horizontal ? height - 60 : width - 60;
  const chartHeight = horizontal ? width - 80 : height - 60;
  const barSpacing = 5; // Reduced spacing between bars
  const actualBarWidth = barWidth; // Use the specified barWidth directly

  if (horizontal) {
    return (
      <View style={[styles.container, { width: height, height: width }]}>
        <Svg width={height} height={width}>
          {/* Y-axis */}
          <Line
            x1={40}
            y1={20}
            x2={40}
            y2={width - 40}
            stroke={yAxisColor}
            strokeWidth={yAxisThickness}
          />

          {/* Grid lines and Y-axis labels */}
          {Array.from({ length: noOfSections + 1 }, (_, i) => {
            const x = 40 + (i * chartWidth) / noOfSections;
            const value = (i * maxValue) / noOfSections;
            return (
              <React.Fragment key={`grid-h-${i}`}>
                <Line
                  x1={x}
                  y1={20}
                  x2={x}
                  y2={width - 40}
                  stroke="#f0f0f0"
                  strokeWidth={1}
                />
                <SvgText
                  x={x}
                  y={width - 25}
                  fontSize="10"
                  fill="#666"
                  textAnchor="middle"
                >
                  {Math.round(value)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Bars */}
          {chartData.map((item: any, index: number) => {
            const barY = 20 + index * (chartHeight / chartData.length);
            const barHeight = Math.min(actualBarWidth, chartHeight / chartData.length - 5);
            
            if (stackData) {
              let currentX = 40;
              return item.stacks.map((stack: any, stackIndex: number) => {
                const barLength = scaleValue(stack.value, 0, maxValue, 0, chartWidth);
                const rect = (
                  <Rect
                    key={`bar-${index}-${stackIndex}`}
                    x={currentX}
                    y={barY}
                    width={barLength}
                    height={barHeight}
                    fill={stack.color}
                  />
                );
                currentX += barLength;
                return rect;
              });
            } else {
              const barLength = scaleValue(item.value, 0, maxValue, 0, chartWidth);
              return (
                <Rect
                  key={`bar-${index}`}
                  x={40}
                  y={barY}
                  width={barLength}
                  height={barHeight}
                  fill={item.frontColor}
                />
              );
            }
          })}

          {/* X-axis labels */}
          {chartData.map((item: any, index: number) => {
            const barY = 20 + index * (chartHeight / chartData.length) + actualBarWidth / 2;
            const textProps = convertTextStyleToSvg(xAxisLabelTextStyle, 30, barY + 4);
            return (
              <SvgText
                key={`label-h-${index}`}
                {...textProps}
                textAnchor={textProps.textAnchor || "end"}
              >
                {item.label || ''}
              </SvgText>
            );
          })}
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Y-axis */}
        <Line
          x1={initialSpacing + 20}
          y1={20}
          x2={initialSpacing + 20}
          y2={height - 40}
          stroke={yAxisColor}
          strokeWidth={yAxisThickness}
        />

        {/* Grid lines and Y-axis labels */}
        {Array.from({ length: noOfSections + 1 }, (_, i) => {
          const y = 20 + (i * chartHeight) / noOfSections;
          const value = maxValue - (i * maxValue) / noOfSections;
          return (
            <React.Fragment key={`grid-v-${i}`}>
              <Line
                x1={initialSpacing + 20}
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
              <SvgText
                x={15}
                y={y + 4}
                fontSize="10"
                fill="#666"
                textAnchor="end"
              >
                {Math.round(value)}
              </SvgText>
            </React.Fragment>
          );
        })}

                 {/* Bars */}
         {chartData.map((item: any, index: number) => {
           const barX = initialSpacing + 20 + index * (actualBarWidth + barSpacing);
           const actualBarWidth2 = actualBarWidth;
          
          if (stackData) {
            let currentY = height - 40;
            return item.stacks.map((stack: any, stackIndex: number) => {
              const barHeight = scaleValue(stack.value, 0, maxValue, 0, chartHeight);
              currentY -= barHeight;
              return (
                <Rect
                  key={`bar-${index}-${stackIndex}`}
                  x={barX + (chartWidth / chartData.length - actualBarWidth2) / 2}
                  y={currentY}
                  width={actualBarWidth2}
                  height={barHeight}
                  fill={stack.color}
                />
              );
            });
          } else {
            const barHeight = scaleValue(item.value, 0, maxValue, 0, chartHeight);
            return (
              <Rect
                key={`bar-${index}`}
                x={barX + (chartWidth / chartData.length - actualBarWidth2) / 2}
                y={height - 40 - barHeight}
                width={actualBarWidth2}
                height={barHeight}
                fill={item.frontColor}
              />
            );
          }
        })}

                          {/* X-axis labels */}
         {chartData.map((item: any, index: number) => {
           const barX = initialSpacing + 20 + index * (actualBarWidth + barSpacing) + actualBarWidth / 2;
           const textProps = convertTextStyleToSvg(xAxisLabelTextStyle, barX, height - 20);
           return (
             <SvgText
               key={`label-v-${index}`}
               {...textProps}
               textAnchor={textProps.textAnchor || "middle"}
             >
               {item.label || ''}
             </SvgText>
           );
         })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});

export default BarChart; 