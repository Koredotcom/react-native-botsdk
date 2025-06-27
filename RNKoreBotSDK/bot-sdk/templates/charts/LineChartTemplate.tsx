import * as React from 'react';
import {View, StyleSheet, processColor, Dimensions} from 'react-native';

import {LineChart} from 'react-native-charts-wrapper';

import BotText from '../BotText';
import BaseView, {BaseViewProps, BaseViewState} from '../BaseView';
import {generateColor, normalize} from '../../utils/helpers';
import {TEMPLATE_STYLE_VALUES} from '../../theme/styles';
const windowWidth = Dimensions.get('window').width;

interface LineChartProps extends BaseViewProps {}
interface LineChartState extends BaseViewState {
  payload?: any;
}

const legend: any = {
  enabled: true,
  textSize: 11,
  form: 'SQUARE',
  horizontalAlignment: 'CENTER',
  verticalAlignment: 'BOTTOM',
  orientation: 'HORIZONTAL',
  wordWrapEnabled: true,
};

const colors = [
  processColor('#78C6C3'),
  processColor('#5F98EB'),
  processColor('#9BC96D'),
  processColor(generateColor()),
  processColor(generateColor()),
  processColor(generateColor()),
  processColor(generateColor()),
  processColor(generateColor()),
  processColor(generateColor()),
  processColor(generateColor()),
];
export default class LineChartTemplate extends BaseView<
  LineChartProps,
  LineChartState
> {
  private renderLineChart = (payload: any) => {
    let data = {
      dataSets: payload?.elements?.map((element: any, i: number) => {
        return {
          values: element.values.map((value: any, index: number) => {
            return {x: index, y: value};
          }),
          label: element.title,
          config: {
            mode: 'LINEAR',
            drawValues: false,
            lineWidth: normalize(2),
            dashedLine: {
              lineLength: 10,
              spaceLength: 0,
              phase: 10,
            },
            drawCircles: true,
            circleColor: colors[i % colors.length],
            drawCircleHole: true,
            circleRadius: normalize(6),
            highlightColor: processColor('transparent'),
            color: colors[i % colors.length],
            drawFilled: false,
            fillGradient: {
              colors: payload?.elements?.map((_element: any, _i: number) => {
                return colors[_i % colors.length];
              }),

              positions: [0, 1],
              angle: 90,
              orientation: 'BOTTOM_TOP',
            },
            fillAlpha: 50,
            valueTextSize: normalize(14),
          },
        };
      }),
    };

    let marker = {
      enabled: true,
      digits: 4,
      backgroundTint: processColor('teal'),
      markerColor: processColor('#F0C0FF8C'),
      textColor: processColor('black'),
    };

    let xAxis: any = {
      valueFormatter: payload.X_axis,
      granularityEnabled: true,
      granularity: 1,

      axisMaximum: payload?.X_axis?.length || 1,
      axisMinimum: 0,
      //centerAxisLabels: true,
      position: 'BOTTOM',
      labelRotationAngle: 30,
      //drawLimitLinesBehindData: false,

      textSize: 8,
      drawGridLines: false,
      avoidFirstLastClipping: true,

      enabled: true,
      drawLabels: true,
      drawAxisLine: true,
    };
    let yAxis = {
      left: {
        spaceTop: 0,
        drawGridLines: false,
      },
      right: {
        spaceTop: 0,
        drawGridLines: false,
        enabled: false,
      },
    };

    return (
      <View style={[styles.container]}>
        <LineChart
          style={[styles.chart, {minWidth: (windowWidth / 4) * 3}]}
          data={data}
          chartDescription={{text: ''}}
          marker={marker}
          xAxis={xAxis}
          yAxis={yAxis}
          drawGridBackground={false}
          borderColor={processColor('teal')}
          borderWidth={1}
          drawBorders={false}
          touchEnabled={true}
          dragEnabled={true}
          scaleEnabled={true}
          scaleXEnabled={true}
          scaleYEnabled={true}
          pinchZoom={true}
          doubleTapToZoomEnabled={true}
          highlightPerTapEnabled={true}
          highlightPerDragEnabled={false}
          dragDecelerationEnabled={true}
          dragDecelerationFrictionCoef={1}
          keepPositionOnRotation={false}
          legend={legend}
          autoScaleMinMaxEnabled={true}
        />
      </View>
    );
  };

  render() {
    return this.props.payload ? (
      <View style={{}}>
        {this.props.payload?.text && (
          <BotText
            text={this.props.payload?.text?.trim()}
            isFilterApply={true}
            isLastMsz={!this.isViewDisable()}
            theme={this.props.theme}
          />
        )}

        {this.renderLineChart(this.props.payload)}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    padding: 5,
    height: normalize(350),
    marginBottom: 5,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
  },
  chart: {
    flex: 1,
  },
});
