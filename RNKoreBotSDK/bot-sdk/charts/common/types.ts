export interface ChartDataPoint {
  value: number;
  label?: string;
  color?: string;
  dataPointText?: string;
}

export interface LineChartDataSet {
  data: ChartDataPoint[];
  label: string;
  color: string;
}

export interface BarChartDataPoint {
  value: number;
  label?: string;
  frontColor: string;
  spacing?: number;
  legend?: string;
}

export interface PieChartDataPoint {
  value: number;
  color: string;
  text?: string;
  displayText: string;
}

export interface BaseChartProps {
  width?: number;
  height?: number;
  data?: any[];
}

export interface LineChartProps extends BaseChartProps {
  dataSet: LineChartDataSet[];
  thickness?: number;
  areaChart1?: boolean;
  isAnimated?: boolean;
  hideDataPoints?: boolean;
  dataPointsRadius?: number;
  initialSpacing?: number;
  noOfSections?: number;
  xAxisLabelTexts?: string[];
  xAxisLabelTextStyle?: any;
  yAxisTextStyle?: any;
  adjustToWidth?: boolean;
  stepValue?: number;
}

export interface BarChartProps extends BaseChartProps {
  data: BarChartDataPoint[];
  barWidth?: number;
  horizontal?: boolean;
  noOfSections?: number;
  initialSpacing?: number;
  yAxisThickness?: number;
  yAxisColor?: string;
  xAxisLabelTextStyle?: any;
  stackData?: any[];
  spacing?: number;
}

export interface PieChartProps extends BaseChartProps {
  data: PieChartDataPoint[];
  radius?: number;
  innerCircleColor?: string;
  innerRadius?: number;
  showText?: boolean;
  donut?: boolean;
  textColor?: string;
  textSize?: number;
  strokeWidth?: number;
  strokeColor?: string;
  animationDuration?: number;
} 