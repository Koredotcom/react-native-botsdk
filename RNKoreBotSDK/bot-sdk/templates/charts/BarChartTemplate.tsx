import * as React from 'react';
import {View, StyleSheet, processColor, Dimensions} from 'react-native';

import {generateColor, normalize} from '../../utils/helpers';
import {BarChart, HorizontalBarChart} from 'react-native-charts-wrapper';
import BotText from '../BotText';
import BaseView, {BaseViewProps, BaseViewState} from '../BaseView';
import Color from '../../theme/Color';
import {isIOS} from '../../utils/PlatformCheck';
const windowWidth = Dimensions.get('window').width;

interface BarChartProps extends BaseViewProps {}
interface BarChartState extends BaseViewState {
  payload?: any;
}

const legend: any = {
  enabled: true,
  textSize: 14,
  form: 'SQUARE',
  formSize: 12,
  xEntrySpace: 10,
  yEntrySpace: 5,
  formToTextSpace: 5,
  wordWrapEnabled: true,
  maxSizePercent: 0.5,
  horizontalAlignment: 'CENTER',
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

export default class BarChartTemplate extends BaseView<
  BarChartProps,
  BarChartState
> {
  private renderBarChartView = (payload: any) => {
    let dataSets = payload.elements.map((element: any, i: number) => {
      return {
        values: element.values,
        label: element.title,
        config: {
          drawValues: true,
          colors: [colors[i % colors.length]],
        },
      };
    });

    let data = {
      dataSets: dataSets,

      config: {
        barWidth: 0.35,
        group: {
          fromX: 0,
          groupSpace: 0.1,
          barSpace: 0.1,
        },
      },
    };

    let xAxis: any = {
      valueFormatter: payload.X_axis,
      granularityEnabled: true,
      granularity: 1,
      axisMaximum: payload?.X_axis?.length || 1,
      axisMinimum: isIOS ? 0 : 0,
      centerAxisLabels: true,
      position: 'BOTTOM',
      labelRotationAngle:
        this.props.payload?.direction === 'vertical' ? 0 : -90,
      drawLimitLinesBehindData: false,

      textSize: 8,
      drawGridLines: false,
      avoidFirstLastClipping: true,
      yOffset: 10,
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

    let marker = {
      enabled: true,
      digits: 3,
      backgroundTint: processColor('teal'),
      markerColor: processColor('#F0C0FF8C'),
      textColor: processColor('black'),
    };
    const height = payload.X_axis.length * 80;
    const Wrapper: any =
      this.props.payload?.direction === 'vertical'
        ? BarChart
        : HorizontalBarChart;
    return (
      <View
        style={[
          styles.container,
          {height: normalize(height), minWidth: (windowWidth / 4) * 3},
        ]}>
        <Wrapper
          pinchZoom={true}
          touchEnabled={true}
          drawGridBackground={false}
          //dragDecelerationEnabled={true}
          style={styles.chart}
          xAxis={xAxis}
          yAxis={yAxis}
          data={data}
          legend={legend}
          drawValueAboveBar={false}
          highlightFullBarEnabled={true}
          minOffset={0}
          marker={marker}
          chartDescription={{
            text: '',
          }}
        />
      </View>
    );
  };

  render() {
    if (!this.props.payload) {
      return <></>;
    }
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.props.payload?.text && (
          <BotText
            text={this.props.payload?.text?.trim()}
            isFilterApply={true}
            isLastMsz={!this.isViewDisable()}
            theme={this.props.theme}
          />
        )}

        <View style={styles.main_container}>
          {this.renderBarChartView(this.props.payload)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    marginTop: 10,
  },
  container: {
    backgroundColor: Color.white,
    padding: 2,
  },
  chart: {
    flex: 1,
  },
});
