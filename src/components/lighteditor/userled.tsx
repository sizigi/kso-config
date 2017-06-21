import * as React from 'react';

import { Colors, Slider, Switch, Collapse } from '@blueprintjs/core';
import { IAppStoreProp, KeyData } from '../../store';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export class UserLedEditor extends React.Component<IAppStoreProp, {}> {

  @observable advancedState = false;

  @action.bound public handleCurrentChange(value: number): void {
    this.props.appStore.selectedDevice!.lightData.userCurrent = value;
  }

  public render() {

    const lightData = this.props.appStore.selectedDevice!.lightData;

    return (<div>
      <div className='pt-form-group pt-inline'>
        <label className='pt-label'>Off Brightness</label>
        <div className='pt-form-content' style={{ flexGrow: 100 }}>
          <div style={{ paddingLeft: 30, paddingRight: 30 }}>
            <Slider
              value={lightData.userOffStrength}
              min={0}
              max={100}
              stepSize={1}
              labelStepSize={25}
              renderLabel={val => `${val.toFixed(0)}%`}
              onChange={val => lightData.userOffStrength = val}
            />
          </div>
        </div>
      </div>


      <div className='pt-form-group pt-inline'>
        <label className='pt-label'>On Brightness</label>
        <div className='pt-form-content' style={{ flexGrow: 100 }}>
          <div style={{ paddingLeft: 30, paddingRight: 30 }}>
            <Slider
              value={lightData.userOnStrength}
              min={0}
              max={100}
              stepSize={1}
              labelStepSize={25}
              renderLabel={(val: number) => `${val.toFixed(0)}%`}
              onChange={val => lightData.userOnStrength = val}
            />
          </div>
        </div>
      </div>

      <Switch label='Advanced Editor' checked={this.advancedState} onClick={() => this.advancedState = !this.advancedState} />

      <Collapse isOpen={this.advancedState}>
        <div className='pt-dark' style={{
            backgroundColor: Colors.DARK_GRAY5,
            borderRadius: 5,
            padding: 10,
            }}>
          <div className='pt-form-group pt-inline'>
            <label className='pt-label'>
              <span>LED&nbsp;Current</span>
            </label>
            <div className='pt-form-content' style={{ flexGrow: 100 }}>
              <div style={{
                paddingLeft: 30,
                paddingRight: 30,
              }}>
                <Slider
                  value={lightData.userCurrent}
                  min={0}
                  max={25}
                  stepSize={1}
                  labelStepSize={5}
                  renderLabel={val => `${val.toFixed(0)}mA`}
                  onChange={val => lightData.userCurrent = val}
                />
              </div>
              <div className='pt-form-helper-text'>Warning: Check your LED datasheet for safe values of I<sub>LED</sub>.
              Excessive current will burn out the LED. 🔥</div>
            </div>
          </div>
        </div>
      </Collapse>
    </div>);
  }
}