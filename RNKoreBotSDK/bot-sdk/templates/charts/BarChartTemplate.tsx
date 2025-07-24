import * as React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { BarChart } from 'react-native-gifted-charts';
import BotText from '../BotText';
import BaseView, { BaseViewProps, BaseViewState } from '../BaseView';
import { TEMPLATE_STYLE_VALUES } from '../../theme/styles';
const windowWidth = Dimensions.get('window').width;
const MATERIAL_COLORS = [
  "#4A9AF2",
  "#5BC8C4",
  "#e74c3c",
  "#3498db"
];

interface BarChartProps extends BaseViewProps { }
interface BarChartState extends BaseViewState {
  payload?: any;
}

export default class BarChartTemplate extends BaseView<
  BarChartProps,
  BarChartState
> {
  private renderBarChartView = (payload: any) => {
    // Calculate the maximum length across all datasets to handle differing dataset sizes
    let elementSize = Math.max(...(payload?.elements?.map((element: any) => element.values.length) || [0]));
    let dataSet = payload?.elements?.flatMap((element: any, index: number) => {
      return element.values.map((value: any, i) => ({
        value: value,
        label: index === 0 ? payload?.X_axis[i] || '' : '', // Only assign labels to the first dataset
        frontColor: MATERIAL_COLORS[index], // Using different colors for each dataset based on index
        spacing: 5,
        legend: element.title
      }));
    });

    const vertical = payload?.direction
    // Merge datasets to create grouped effect
    const groupedData = dataSet.slice(0, elementSize).flatMap((item, index) => [
      { ...item, spacing: 3 }, // Person 1
      { ...dataSet.slice(elementSize, dataSet.length)[index], spacing: 10 }, // Person 2
    ]);

    return (
      <View style={[styles.container, { height: vertical !== 'vertical' ? 380 : 280 }]}>
        <View style={styles.legendContainer}>
          {payload?.elements?.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: MATERIAL_COLORS[index] }]} />
              <Text style={styles.legendText}>{item.title}</Text>
            </View>
          ))}
        </View>
        <BarChart
          width={vertical !== 'vertical' ? windowWidth - 140 : windowWidth - 115}
          height={vertical !== 'vertical' ? 260 : 220}
          barWidth={27}
          data={groupedData}
          horizontal={vertical !== 'vertical'}
          noOfSections={4}
          initialSpacing={10}
          yAxisThickness={1}
          yAxisColor="#ccc"
          xAxisLabelTextStyle={{ marginStart: vertical !== 'vertical' ? -18 : -27, fontSize: 8, transform: [{ rotate: vertical !== 'vertical' ? '315deg' : '0deg' }] }}
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
    paddingTop: 5,
    marginBottom: 5,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    width: windowWidth - 55,
  },
  legendContainer: {
    flexDirection: 'row',
    marginStart: 10,
    justifyContent: 'center'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  legendColor: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  chart: {
    flex: 1,
  },
});
