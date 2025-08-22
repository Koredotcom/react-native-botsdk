import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { LineChartProps } from '../common/types';
import { generatePath, scaleValue, getMaxValue, getMinValue, getWindowWidth, convertTextStyleToSvg } from '../common/utils';

const LineChart: React.FC<LineChartProps> = ({
  width = getWindowWidth() - 120,
  height = 210,
  dataSet = [],
  thickness = 3,
  isAnimated = true,
  hideDataPoints = false,
  dataPointsRadius = 4,
  initialSpacing = 50,
  noOfSections = 4,
  xAxisLabelTexts = [],
  xAxisLabelTextStyle = {},
  yAxisTextStyle = {},
}) => {
  if (!dataSet || dataSet.length === 0) {
    return <View style={[styles.container, { width, height }]} />;
  }

  const chartWidth = width - initialSpacing * 2;
  const chartHeight = height - 80; // Leave space for labels (Y-axis top + X-axis bottom)
  
  // Get min/max values across all datasets
  const allValues = dataSet.flatMap(dataset => dataset.data.map(point => point.value));
  const maxValue = getMaxValue(allValues.map(v => ({ value: v })));
  const minValue = getMinValue(allValues.map(v => ({ value: v })));
  
  const maxDataLength = Math.max(...dataSet.map(dataset => dataset.data.length));
  const stepX = chartWidth / (maxDataLength - 1 || 1);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {Array.from({ length: noOfSections + 1 }, (_, i) => {
          const y = 40 + (i * chartHeight) / noOfSections;
          return (
            <Line
              key={`grid-${i}`}
              x1={initialSpacing}
              y1={y}
              x2={width - initialSpacing}
              y2={y}
              stroke="#f0f0f0"
              strokeWidth={1}
            />
          );
        })}

        {/* Y-axis labels */}
        {Array.from({ length: noOfSections + 1 }, (_, i) => {
          const y = 40 + (i * chartHeight) / noOfSections;
          const value = maxValue - (i * (maxValue - minValue)) / noOfSections;
          const textProps = convertTextStyleToSvg(yAxisTextStyle, initialSpacing - 5, y + 4);
          return (
            <SvgText
              key={`y-label-${i}`}
              {...textProps}
              textAnchor={textProps.textAnchor || "end"}
            >
              {Math.round(value)}
            </SvgText>
          );
        })}

        {/* Render each dataset */}
        {dataSet.map((dataset, datasetIndex) => {
          const points = dataset.data.map((point, index) => ({
            x: initialSpacing + index * stepX,
            y: 40 + scaleValue(point.value, minValue, maxValue, chartHeight, 0)
          }));

          const pathData = generatePath(points, false);

          return (
            <React.Fragment key={`dataset-${datasetIndex}`}>
              {/* Line path */}
              <Path
                d={pathData}
                stroke={dataset.color}
                strokeWidth={thickness}
                fill="none"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />

              {/* Data points */}
              {!hideDataPoints && points.map((point, pointIndex) => (
                <Circle
                  key={`point-${datasetIndex}-${pointIndex}`}
                  cx={point.x}
                  cy={point.y}
                  r={dataPointsRadius}
                  fill={dataset.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </React.Fragment>
          );
        })}

        {/* X-axis labels */}
        {xAxisLabelTexts.map((label, index) => {
          const x = initialSpacing + index * stepX + 25;
          const y = height - 25;
          const textProps = convertTextStyleToSvg(xAxisLabelTextStyle, x, y);
          return (
            <SvgText
              key={`x-label-${index}`}
              {...textProps}
              textAnchor={textProps.textAnchor || "middle"}
            >
              {label}
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

export default LineChart; 