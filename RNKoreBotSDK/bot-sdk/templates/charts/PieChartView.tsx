import * as React from 'react';
import { View, StyleSheet, processColor, Dimensions, Text} from 'react-native';
import { PieChart } from '../../charts';
import BotText from '../BotText';
import { generateColor, normalize } from '../../utils/helpers';
import { TEMPLATE_STYLE_VALUES } from '../../theme/styles';
import BaseView, { BaseViewProps, BaseViewState } from '../BaseView';
const windowWidth = Dimensions.get('window').width;

const PIE_TYPE_DONUT = 'donut';

interface PieChartProps extends BaseViewProps { }
interface PieChartState extends BaseViewState { }
const legend: any = {
  enabled: true,
  textSize: 11,
  form: 'SQUARE',
  horizontalAlignment: 'CENTER',
  verticalAlignment: 'BOTTOM',
  orientation: 'HORIZONTAL',
  wordWrapEnabled: true,
};

const MATERIAL_COLORS = [
  "#5BC8C4",
  "#4A9AF2",
  "#8ECB60",
  "#BDA100",
  "#E36CA2",
  "#591880",
  "#3AB961",
  "#654BAF",
  "#E36CA2",
  "#1B3880",
  "#9D1850",
  "#DB9400",
  "#008930"
];

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

export default class PieChartTemplate extends BaseView<
  PieChartProps,
  PieChartState
> {
  private getExtraConfig = (payload: any) => {
    if (!payload) {
      return {};
    }

    return payload.pie_type === PIE_TYPE_DONUT
      ? {
        xValuePosition: 'OUTSIDE_SLICE',
        yValuePosition: 'OUTSIDE_SLICE',
        drawValues: true,
        valueTextColor: processColor('black'),
        valueLinePart2Length: 0.2,
      }
      : {
        valueLinePart2Length: 0,
        valueLineWidth: 0,
        valueLineColor: processColor('white'),
        drawValues: true,
        valueTextColor: processColor('white'),
      };
  };

  private renderPieChartView = (payload: any) => {
    let extraConfig = this.getExtraConfig(payload);
    const isDonut = payload.pie_type === PIE_TYPE_DONUT

    let dataSet = payload?.elements?.map((element: any, i: number) => {
      return {
        value: parseFloat(element?.value),
        color: MATERIAL_COLORS[i],
        text: element?.displayValue,
        displayText: element?.title
      };
    });

    // let data: any = {
    //   dataSets: [
    //     {
    //       values: payload?.elements?.map?.((element: any) => {
    //         return {
    //           value: parseFloat(element?.value),
    //           label: element?.title + ' ' + element?.value,
    //         };
    //       }),
    //       label: '',
    //       config: {
    //         colors: colors,
    //         valueTextSize: 11,
    //         sliceSpace: 3,
    //         selectionShift: 10,
    //         valueFormatter: "#.## '%'",
    //         ...extraConfig,
    //       },
    //     },
    //   ],
    // };

    let highlights: any = [];
    let description = {
      text: '',
      textSize: 15,
      textColor: processColor('darkgray'),
    };

    let holeRadius = 0;
    let transparentCircleRadius = 0;

    let pieType = payload.pie_type;
    if (pieType && pieType === PIE_TYPE_DONUT) {
      holeRadius = 55;
      transparentCircleRadius = 60;
    }
    let marker = {
      enabled: true,
      digits: 3,
      backgroundTint: processColor('teal'),
      markerColor: processColor('#F0C0FF8C'),
      textColor: processColor('black'),
    };

    let styledCenterText = {
      text: '',
      color: processColor(generateColor()),
      fontFamily: 'HelveticaNeue-Medium',
      size: normalize(12),
    };

    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={[
          styles.container,
          {
            width: (windowWidth / 4) * 3, //normalize(280), //
          },
        ]}>
        <PieChart
          data={dataSet}
          radius={145}           // Adjusts the size of the pie chart
          innerCircleColor="white" // Color of the inner circle (for donut effect)
          innerRadius={60}   // Radius of the inner circle (for donut effect)
          showText
          donut={isDonut}
          textColor="white"
          textSize={12}
          strokeWidth={2}       // Thickness of the pie slice edges
          strokeColor="#fff"    // Color of the pie slice edges
          animationDuration={500} // Animation duration in milliseconds
        />
        <View style={styles.legendContainer}>
          {dataSet.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.displayText} {item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  render() {
    return this.props.payload ? (
      <View>
        <View style={styles.sub_container}>
          {this.props.payload?.text && (
            <BotText
              text={this.props.payload?.text?.trim?.()}
              isFilterApply={true}
              isLastMsz={!this.isViewDisable()}
              theme={this.props.theme}
            />
          )}
        </View>
        <View style={[styles.chart_view]}>
          {this.renderPieChartView(this.props.payload)}
        </View>
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  chart_view: {
    padding: 10,
    backgroundColor: 'white',
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    alignItems: 'center',
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
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#333',
  },
  text: {
    flexWrap: 'wrap',
    color: '#485260',
    fontSize: normalize(16),
    margin: 5,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },
  sub_container: {
    marginBottom: 10,
    marginTop: 5,
  },
  centerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    //flex: 1,
    // backgroundColor: 'red',
    // width: '100%',
    height: normalize(320),
    marginBottom: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  chart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
