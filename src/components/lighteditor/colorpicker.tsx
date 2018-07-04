import * as React from 'react';
import { action, observable } from 'mobx';
import { BlockPicker, ColorResult } from 'react-color';
import { Button, InputGroup, Popover, Position, NumericInput } from '@blueprintjs/core';
import { Color } from '../../store';
import { observer } from 'mobx-react';

class LedColorPickerState {
  @observable color: Color = new Color();
}

const palette = [
  '#000000',
  '#2c3e50',
  '#8e44ad',
  '#2980b9',
  '#27ae60',
  '#16a085',
  '#f39c12',
  '#d35400',
  '#c0392b',
  '#bdc3c7',
];

@observer
export class LedColorPicker extends React.Component<{ label: string | JSX.Element }, {}> {

  private pickerState = new LedColorPickerState();

  constructor() {
    super();
  }

  @action.bound
  private handleColorChange(colorChangeResult: ColorResult): void {
    const { a, ...rgb } = colorChangeResult.rgb;
    this.pickerState.color.set(rgb);
  }

  public render() {
    return (<div>
      <div className='pt-form-group'>
        <label className='pt-label'>
          {this.props.label}
        </label>
        <div className='pt-control-group'>
          <div className='pt-select'>
            <select>
              <option>Fade Out</option>
              <option>Set Color To</option>
              <option>Breath Color</option>
              <option>Pulse Color</option>
            </select>
          </div>
          <Popover
            position={Position.RIGHT} className='pt-dark'>
            <Button
              iconName='tint'
              style={{ backgroundColor: this.pickerState.color.toHex }}
            />
            <BlockPicker
              triangle='hide'
              colors={palette}
              color={this.pickerState.color}
              onChangeComplete={this.handleColorChange}
            />
          </Popover>
          <Button text='with speed' disabled={true} />
          <NumericInput
            leftIconName='time'
            placeholder='1000ms'
          />
        </div>
      </div>
    </div>);
  }
}