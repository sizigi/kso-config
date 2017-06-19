import * as React from 'react';
import { action, observable} from 'mobx';
import { AppStore, Color } from '../store';
import { BlockPicker, ColorResult} from 'react-color';
import { Switch, Button, Popover, Position, Slider, Colors } from '@blueprintjs/core';
import { observer } from 'mobx-react';

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

  @action.bound public handleCurrentChange(value: number): void {
    this.props.appStore.selectedDevice!.lightData.userCurrent = value;
  }

  public render() {
    return <div>
      <Switch label='Enable RGB LED' />

      <div className='pt-dark' style={{
          backgroundColor: Colors.DARK_GRAY5,
          borderRadius: 5,
          padding: 10,
          }}>
        <LedColorPicker />
        <LedColorPicker />
      </div>

      <Switch label='Enable User LED' />

      <div className='pt-dark' style={{
          backgroundColor: Colors.DARK_GRAY5,
          borderRadius: 5,
          padding: 10,
          }}>

        <div className='pt-form-group pt-inline'>
          <label className='pt-label'>Off Brightness</label>
          <div className='pt-form-content' style={{flexGrow: 100}}>
            <div style={{paddingLeft: 30, paddingRight: 30}}>
              <Slider
                  value={this.props.appStore.selectedDevice!.lightData.userCurrent}
                  min={0}
                  max={100}
                  stepSize={1}
                  labelStepSize={25}
                  renderLabel={(val: number) => `${val.toFixed(0)}%`}
                  onChange={this.handleCurrentChange}
                />
              </div>
          </div>
        </div>

        <div className='pt-form-group pt-inline'>
          <label className='pt-label'>On Brightness</label>
          <div className='pt-form-content' style={{flexGrow: 100}}>
            <div style={{paddingLeft: 30, paddingRight: 30}}>
              <Slider
                  value={this.props.appStore.selectedDevice!.lightData.userCurrent}
                  min={0}
                  max={100}
                  stepSize={1}
                  labelStepSize={25}
                  renderLabel={(val: number) => `${val.toFixed(0)}%`}
                  onChange={this.handleCurrentChange}
                />
              </div>
          </div>
        </div>

        <div className='pt-form-group pt-inline'>
          <label className='pt-label'>
            <span>LED&nbsp;Current</span>
            <Switch />
          </label>
          <div className='pt-form-content' style={{flexGrow: 100}}>
            <div style={{
              paddingLeft: 30,
              paddingRight: 30,
            }}>
              <Slider
                  value={this.props.appStore.selectedDevice!.lightData.userCurrent}
                  min={0}
                  max={25}
                  stepSize={1}
                  labelStepSize={5}
                  renderLabel={(val: number) => `${val.toFixed(0)}mA`}
                  onChange={this.handleCurrentChange}
                />
              </div>
            <div className='pt-form-helper-text'>Warning: Check your LED datasheet for appropriate current values.</div>
          </div>
        </div>
      </div>
    </div>;
  }
}