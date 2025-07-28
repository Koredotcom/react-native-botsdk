import { Dimensions } from 'react-native';

export const MATERIAL_COLORS = [
  "#4A9AF2",
  "#5BC8C4", 
  "#e74c3c",
  "#3498db"
];

export const getWindowWidth = () => Dimensions.get('window').width;

// Convert React Native text styles to SVG-compatible properties
export const convertTextStyleToSvg = (style: any = {}, baseX: number = 0, baseY: number = 0) => {
  const svgProps: any = {};
  
  // Font properties (direct mapping with defaults)
  svgProps.fontSize = style.fontSize || "8";
  if (style.fontFamily) svgProps.fontFamily = style.fontFamily;
  if (style.fontWeight) svgProps.fontWeight = style.fontWeight;
  if (style.fontStyle) svgProps.fontStyle = style.fontStyle;
  
  // Color mapping (with default)
  svgProps.fill = style.color || "#666";
  
  // Text alignment
  if (style.textAlign) {
    switch (style.textAlign) {
      case 'left':
        svgProps.textAnchor = 'start';
        break;
      case 'center':
        svgProps.textAnchor = 'middle';
        break;
      case 'right':
        svgProps.textAnchor = 'end';
        break;
      default:
        svgProps.textAnchor = style.textAlign;
    }
  }
  
  // Position adjustments (convert margins to dx/dy offsets)
  let dx = 0, dy = 0;
  if (style.marginLeft) dx += style.marginLeft;
  if (style.marginStart) dx += style.marginStart;
  if (style.marginTop) dy += style.marginTop;
  if (style.marginBottom) dy -= style.marginBottom;
  
  // Apply position adjustments
  svgProps.x = baseX + dx;
  svgProps.y = baseY + dy;
  

  
  // Handle transform - convert RN transform array to SVG transform string
  if (style.transform && Array.isArray(style.transform)) {
    const transforms: string[] = [];
    style.transform.forEach((t: any) => {
      if (t.rotate) {
        // Extract rotation value and convert to SVG format
        const rotation = typeof t.rotate === 'string' ? 
          parseFloat(t.rotate.replace('deg', '')) : t.rotate;
        transforms.push(`rotate(${rotation}, ${svgProps.x || baseX}, ${svgProps.y || baseY})`);
      }
      if (t.scale) {
        transforms.push(`scale(${t.scale})`);
      }
      if (t.translateX || t.translateY) {
        transforms.push(`translate(${t.translateX || 0}, ${t.translateY || 0})`);
      }
    });
    if (transforms.length > 0) {
      svgProps.transform = transforms.join(' ');
    }
  }
  
  return svgProps;
};

export const generatePath = (points: Array<{x: number, y: number}>, smooth: boolean = true): string => {
  if (points.length === 0) return '';
  
  if (!smooth) {
    return points.reduce((path, point, index) => {
      return index === 0 ? `M${point.x},${point.y}` : `${path}L${point.x},${point.y}`;
    }, '');
  }
  
  // Smooth curve generation using cubic bezier
  let path = `M${points[0].x},${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currentPoint = points[i];
    const nextPoint = points[i + 1];
    
    if (nextPoint) {
      const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
      const cp1y = prevPoint.y + (currentPoint.y - prevPoint.y) / 3;
      const cp2x = currentPoint.x - (nextPoint.x - prevPoint.x) / 3;
      const cp2y = currentPoint.y - (nextPoint.y - prevPoint.y) / 3;
      
      path += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${currentPoint.x},${currentPoint.y}`;
    } else {
      path += `L${currentPoint.x},${currentPoint.y}`;
    }
  }
  
  return path;
};

export const scaleValue = (value: number, min: number, max: number, outputMin: number, outputMax: number): number => {
  if (max === min) return outputMin;
  return outputMin + ((value - min) / (max - min)) * (outputMax - outputMin);
};

export const getMaxValue = (data: Array<{value: number}>): number => {
  return Math.max(...data.map(d => d.value), 0);
};

export const getMinValue = (data: Array<{value: number}>): number => {
  return Math.min(...data.map(d => d.value), 0);
}; 