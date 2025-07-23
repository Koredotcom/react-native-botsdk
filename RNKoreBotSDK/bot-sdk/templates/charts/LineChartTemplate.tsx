import * as React from 'react';
import { View, StyleSheet, processColor, Dimensions, Text } from 'react-native';

import { LineChart } from 'react-native-gifted-charts';

import BotText from '../BotText';
import BaseView, { BaseViewProps, BaseViewState } from '../BaseView';
import { generateColor, normalize } from '../../utils/helpers';
import { TEMPLATE_STYLE_VALUES } from '../../theme/styles';
const windowWidth = Dimensions.get('window').width;
const MATERIAL_COLORS = [
  "#4A9AF2",
  "#5BC8C4",
  "#e74c3c",
  "#3498db"
];

interface LineChartProps extends BaseViewProps { }
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
    let dataSet = payload?.elements?.map((element: any, index: number) => {
      return {
        data: element.values.map((value: any) => ({
          value: value,
          dataPointText: `${value}`,
        })),
        label: element?.title,
        color: MATERIAL_COLORS[index % 4],
      };
    });

    // Generate X-axis Labels from Data
    const getXAxisLabels = (payload) => {
      return payload?.X_axis?.map((element) => String(element)) ?? [];
    }

    // let data = {
    //   dataSets: payload?.elements?.map((element: any, i: number) => {
    //     return {
    //       values: element.values.map((value: any, index: number) => {
    //         return {x: index, y: value};
    //       }),
    //       label: element.title,
    //       config: {
    //         mode: 'LINEAR',
    //         drawValues: false,
    //         lineWidth: normalize(2),
    //         dashedLine: {
    //           lineLength: 10,
    //           spaceLength: 0,
    //           phase: 10,
    //         },
    //         drawCircles: true,
    //         circleColor: colors[i % colors.length],
    //         drawCircleHole: true,
    //         circleRadius: normalize(6),
    //         highlightColor: processColor('transparent'),
    //         color: colors[i % colors.length],
    //         drawFilled: false,
    //         fillGradient: {
    //           colors: payload?.elements?.map((_element: any, _i: number) => {
    //             return colors[_i % colors.length];
    //           }),

    //           positions: [0, 1],
    //           angle: 90,
    //           orientation: 'BOTTOM_TOP',
    //         },
    //         fillAlpha: 50,
    //         valueTextSize: normalize(14),
    //       },
    //     };
    //   }),
    // };

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

    const xAxisLabels = getXAxisLabels(payload);

    return (
      <View style={[styles.container]}>
        <LineChart
          width={windowWidth - 120}
          dataSet={dataSet}
          thickness={3}
          areaChart1
          stepValue={15}
          adjustToWidth
          isAnimated
          hideDataPoints={false}
          dataPointsRadius={4}
          initialSpacing={25}
          yAxisTextStyle={{ color: "#000", fontSize: 12, fontWeight: "bold" }} // Y-axis label style
          noOfSections={4} // Ensure this is appropriate for your data range
          xAxisLabelTexts={xAxisLabels}
          xAxisLabelTextStyle={{ marginTop: 10, marginLeft: -27, color: '#000', fontSize: 7, fontWeight: "bold", transform: [{ rotate: '315deg' }] }}
        />
        <View style={styles.legendContainer}>
          {dataSet.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
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
    height: 280,
    marginBottom: 5,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    width: windowWidth - 60,
  },
  legendContainer: {
    marginTop: 20,
    width: '80%',
    flexDirection: 'row'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginStart: 10
  },
  legendColor: {
    width: 20,
    height: 3,
    borderRadius: 0,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#333',
  },
  chart: {
    flex: 1,
  },
});
