import * as React from 'react';
import {View, StyleSheet, processColor, Dimensions} from 'react-native';
import {PieChart} from 'react-native-charts-wrapper';
import BotText from '../BotText';
import {generateColor, normalize} from '../../utils/helpers';
import {TEMPLATE_STYLE_VALUES} from '../../theme/styles';
import BaseView, {BaseViewProps, BaseViewState} from '../BaseView';
const windowWidth = Dimensions.get('window').width;

const PIE_TYPE_DONUT = 'donut';

interface PieChartProps extends BaseViewProps {}
interface PieChartState extends BaseViewState {}
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

    let data: any = {
      dataSets: [
        {
          values: payload?.elements?.map?.((element: any) => {
            return {
              value: parseFloat(element?.value),
              label: element?.title + ' ' + element?.value,
            };
          }),
          label: '',
          config: {
            colors: colors,
            valueTextSize: 11,
            sliceSpace: 3,
            selectionShift: 10,
            valueFormatter: "#.## '%'",
            ...extraConfig,
          },
        },
      ],
    };

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
          // xAxis={xAxis}
          style={styles.chart}
          logEnabled={true}
          chartBackgroundColor={processColor('white')}
          chartDescription={description}
          data={data}
          legend={legend}
          highlights={highlights}
          //extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}
          entryLabelColor={processColor('white')}
          entryLabelTextSize={12}
          entryLabelFontFamily={'HelveticaNeue-Medium'}
          drawEntryLabels={false}
          rotationEnabled={true}
          rotationAngle={270}
          usePercentValues={true}
          styledCenterText={styledCenterText}
          highlightPerTapEnabled={true}
          centerTextRadiusPercent={100}
          holeRadius={holeRadius}
          holeColor={processColor('#f0f0f0')}
          transparentCircleRadius={transparentCircleRadius}
          transparentCircleColor={processColor('#f0f0f088')}
          maxAngle={360}
          marker={marker}
        />
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
  container: {
    //flex: 1,
    // backgroundColor: 'red',
    // width: '100%',
    height: normalize(280),
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
