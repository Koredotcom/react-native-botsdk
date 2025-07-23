/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { BarChart } from 'react-native-gifted-charts';
import BotText from '../BotText';
import BaseView, { BaseViewProps, BaseViewState } from '../BaseView';
import Color from '../../theme/Color';
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

export default class StackBarChartTemplate extends BaseView<
  BarChartProps,
  BarChartState
> {
  private renderBarChartView = (payload: any) => {
    const convertToStackedFormat = (payload) => {
      const { X_axis, elements } = payload;

      return X_axis.map((label, index) => ({
        label: label,
        stacks: elements.map((element, i) => ({
          value: element.values[index] || 0, // Taking value for this X-axis
          color: MATERIAL_COLORS[i % MATERIAL_COLORS.length],
        }))
      }));
    };

    // Convert dataset
    const formattedDataSet = convertToStackedFormat(payload);

    return (
      <View>
        <BarChart
          width={ windowWidth - 115}
          height={ 220 }
          barWidth={ 27 }
          stackData={formattedDataSet}
          noOfSections={4}
          spacing={30} 
          initialSpacing={30}
          yAxisThickness={1}
          yAxisColor="#ccc"
          xAxisLabelTextStyle={{ marginStart: -18 , fontSize: 8, transform: [{ rotate: '330deg' }] }}
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
