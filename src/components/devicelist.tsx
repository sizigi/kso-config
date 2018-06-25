import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { observer } from 'mobx-react';
import { NonIdealState, Button } from '@blueprintjs/core';
import { AppStore } from '../store'
import * as classNames from 'classNames'

@observer
export class DeviceList extends React.Component<{ appStore: AppStore }, Readonly<any>> {

  render() {
    const { appStore } = this.props;

    let items: Array<JSX.Element> = [];
    items = appStore.devices.values().map((device) => {
      return (
        <div
          key={device.path}
          className={classNames('kso-tab', { 'active': appStore.selectedDevice == device })}
          onClick={() => { appStore.selectedDevice = device }}
        >
          <img src="http://placehold.it/48x48" style={{ borderRadius: 48, marginRight: 20 }}></img>
          <div style={{ paddingTop: 10 }}>
            <h4>{device.name}</h4>
            <h6 className="pt-text-muted">Key: F1</h6>
          </div>
        </div>
      )
    });

    return (
      <div>
        <CSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {items}
        </CSSTransitionGroup>
        {items.length === 0
          ? (<div className="p-t-lg">
            <NonIdealState
              visual="warning-sign"
              title="No devices found"
              description="No supported devices were detected. Try plugging one in."
              action={
                <Button
                  iconName="refresh"
                  text="Refresh"
                  className="pt-minimal"
                  onClick={this.props.appStore.updateDevices} />
              } />
          </div>)
          : <div></div>}
      </div>
    );

  }
}