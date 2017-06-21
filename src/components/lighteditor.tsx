import * as React from 'react';
import { action, observable } from 'mobx';
import { AppStore, Color } from '../store';
import { BlockPicker, ColorResult } from 'react-color';
import {
  Button,
  Colors,
  Popover,
  Position,
  Switch
  } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import { UserLedEditor } from './lighteditor/userled';

class LedColorPickerState {
  @observable color: Color = new Color();
}

@observer
export class LedColorPicker extends React.Component<{}, {}> {

  private pickerState = new LedColorPickerState();

  constructor() {
    super();
  }

  @action.bound
  private handleColorChange(colorChangeResult: ColorResult): void {
    const {a, ...rgb} = colorChangeResult.rgb;
    this.pickerState.color.set(rgb);
  }

  public render() {
    return (<Popover position={Position.BOTTOM}>
      <Button text='Hello World' iconName='tint' style={{backgroundColor: this.pickerState.color.toHex}}/>
      <BlockPicker color={this.pickerState.color} onChangeComplete={this.handleColorChange} />
      </Popover>);
  }
}

@observer
export class LightEditor extends React.Component<{appStore: AppStore}, {}> {

  public render() {
    return (<div>
      {/*<Switch label='Enable RGB LED' />

      <div className='pt-dark' style={{
          backgroundColor: Colors.DARK_GRAY5,
          borderRadius: 5,
          padding: 10,
          }}>
        <LedColorPicker />
        <LedColorPicker />
      </div>
      <Switch label='Enable User LED' />*/}

      <UserLedEditor appStore={this.props.appStore}/>
      {/*<div className='pt-dark' style={{
          backgroundColor: Colors.DARK_GRAY5,
          borderRadius: 5,
          padding: 10,
          }}>
      </div>*/}
    </div>);
  }
}