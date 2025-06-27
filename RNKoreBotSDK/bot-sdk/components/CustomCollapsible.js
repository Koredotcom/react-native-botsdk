import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
//import {Icon} from '../../utils/Icon.js';
import Collapsible from 'react-native-collapsible';

class CustomCollapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsible: true,
    };
    this.icons = {
      up: 'Dropdown-Up',
      down: 'Dropdown-Down',
    };
  }

  render() {
    let icon = this.icons['down'];

    if (!this.state.isCollapsible) {
      icon = this.icons['up'];
    }
    const Wrapper = this.props.type === 'postback' ? TouchableOpacity : View;
    return (
      <View style={{flexDirection: 'column'}}>
        <Wrapper
          onPress={() => {
            if (this.props.itemPress) {
              this.props.itemPress();
            }
          }}>
          <View style={{flexDirection: 'row', marginBottom: 5, marginTop: 5}}>
            <View style={{flex: 1}}>{this.props.titleView}</View>
            <TouchableOpacity
              style={{
                position: 'absolute',
                end: 15,
                paddingStart: 20,
                paddingBottom: 15,
                paddingEnd: 5,
                paddingTop: 5,
                // padding: 5,
                alignSelf: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({
                  isCollapsible: !this.state.isCollapsible,
                });
              }}>
              <Text>{icon}</Text>
              {/* <Icon
                color={this.props.iconColor ? this.props.iconColor : '#8B959F'}
                name={icon}
                size={16}
              /> */}
            </TouchableOpacity>
          </View>
        </Wrapper>

        <Collapsible collapsed={this.state.isCollapsible}>
          <View
            style={{
              marginTop: -10,
              marginBottom: 5,
              flex: 1,
              justifyContent: 'space-evenly',
              minHeight: 90,
            }}>
            {this.props.subView}
          </View>
        </Collapsible>
        {this.props.showBottomLine && (
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: '#5F6368',
              width: '95%',
              height: 0.4,
              opacity: 0.3,
              marginTop: 5,
              marginEnd: 10,
              marginBottom: 5,
            }}></View>
        )}
      </View>
    );
  }
}

export default CustomCollapsible;
