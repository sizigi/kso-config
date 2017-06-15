import * as classNames from 'classNames';
import * as React from 'react';
import DevTools from 'mobx-react-devtools';
import {
  action,
  observable,
  IObservableValue,
  ObservableMap,
  whyRun
} from 'mobx';
import { Button, EditableText } from '@blueprintjs/core';
import {
  Colors,
  FocusStyleManager,
  Intent,
  NonIdealState,
  Position,
  Popover,
  Menu,
  MenuItem,
  Dialog,
  Tab2,
  Tabs2,
  Tooltip,
} from '@blueprintjs/core';
import { CSSTransitionGroup } from 'react-transition-group';
import { Device, devices, HID } from 'node-hid';
import { HotkeyInput } from './hotkey';
import { MainToaster } from './toaster';
import { observer} from 'mobx-react';
import { SingleHidKeyReport } from './hidreport';
import { SingleKeyReportEditor } from './singlekeyreporteditor';
import { ipcRenderer } from 'electron';

import {MenuSelect} from './components';


FocusStyleManager.onlyShowFocusOnTabs();

export class KeyData {
  @observable name: string;
  @observable report: SingleHidKeyReport;
  @observable serial: string;
  @observable firmware: string;
  @observable address: string;
  @observable path: string;

  @observable keyMode: IObservableValue<string>;
  @observable lightMode: IObservableValue<string>;

  constructor(device: Device) {
    this.name = device.product;
    this.report = new SingleHidKeyReport();
    this.serial = device.serialNumber;
    this.firmware = 'Unknown';
    this.address = '0xA1';
    this.path = device.path;
    this.keyMode = observable('keypress');
  }

  static isSupported(device: Device): boolean {
    return /USB/.test(device.product);
  }
}

export class AppStore {
  @observable devices: ObservableMap<KeyData>;
  constructor() {
    this.devices = observable.map<KeyData>();
  }

  @action.bound public updateDevices(): void {
    console.log('updating...');
    let allHidDevices = devices();

    this.devices.clear();

    for (let d of allHidDevices) {
      if (!KeyData.isSupported(d)) continue;
      this.devices.set(d.path, new KeyData(d));
    }
  }

}

let keyReport = new SingleHidKeyReport();

@observer
export class App extends React.Component<undefined, undefined> {
  private store: AppStore;

  // private @computed test = observable('test');


  constructor() {
    super()
    ipcRenderer.on('usb:change', this.onUsbChange);
    this.store = new AppStore();
  }

  private onUsbChange(): void {
    console.log('Change Event');
  }

  render() {
    const items = this.store.devices.values().map((device) => {
      return (
        <div key={device.path} className={classNames('kso-tab', { 'active': false })}>
          <img src="http://placehold.it/48x48" style={{ borderRadius: 48, marginRight: 20 }}></img>
          <div style={{ paddingTop: 10 }}>
            <h4>{device.name}</h4>
            <h6 className="pt-text-muted">Key: F1</h6>
          </div>
        </div>
      )
    });

    return (
      <div
        style={{
          backgroundColor: Colors.LIGHT_GRAY5,
          height: '100vh',
          display: 'flex',
        }}
      >
        <DevTools />
        <nav style={{ flex: 1, backgroundColor: Colors.LIGHT_GRAY1, height: '100vh' }}>
          <div className='pt-navbar pt-dark kso-navbar'>
            <div className="pt-navbar-group pt-align-left">
              <div className="pt-navbar-heading pt-text-muted">keyswitch.one</div>
            </div>
            <div className="pt-navbar-group pt-align-right">
              <button
                className="pt-button pt-minimal pt-icon-refresh"
                onClick={this.store.updateDevices}
              />
            </div>
          </div>
          <div style={{ height: 'calc(100vh - 75px)' }} data-simplebar>
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
                  description="No supported devices were detected. Try plugging one in." />
              </div>)
              : <div></div>}
          </div>
        </nav>

        <section style={{ flex: 2 }}>
          <div id='title-bar' />
          <div style={{ padding: 20, paddingTop: 0 }}>
            <Button
              style={{ float: "right" }}
              text="Save"
              onClick={() => {
                MainToaster.show({
                  message: "Saved!",
                  intent: Intent.SUCCESS,
                  iconName: "floppy-disk",
                })
              }}
              iconName='floppy-disk'
              className={classNames('pt-button', 'pt-large', 'pt-intent-primary')} />
            <h1>
              <EditableText placeholder="Click to name..." maxLength={32} />
            </h1>
            <ul className="pt-list-unstyled">
              <li>
                <Tooltip content="On-chip Hardware ID" intent={Intent.PRIMARY} position={Position.LEFT}>
                  <strong>Serial:&nbsp;</strong>
                </Tooltip>
                <span>5AE3FB6DEEFFB3</span>
              </li>
              <li>
                <Tooltip content="Current device firmware" intent={Intent.PRIMARY} position={Position.LEFT}>
                  <strong>Firmware:&nbsp;</strong>
                </Tooltip>
                <span>A01</span>
              </li>
              <li><strong>I<sup>2</sup>C Address:&nbsp;</strong>
                <EditableText placeholder="Address" defaultValue="0x4F" />
              </li>
              <li>
                <strong>Key Mode:&nbsp;</strong>
                <MenuSelect header="Set Key Mode"
                  value={observable('keypress')}
                  options={[
                    {name: 'Keypress', icon:'pt-icon-new-text-box', value:'keypress'},
                    {name: 'Macro', icon:'pt-icon-calculator', value:'macro'},
                    {name: 'None', icon:'pt-icon-disable', value:'none'},
                  ]} >
                </MenuSelect>
              </li>
              <li>
                <strong>Light Mode:&nbsp;</strong>
                <a>
                  <span>Off</span>
                  <span className={classNames('pt-icon-caret-down')} />
                </a>
              </li>
            </ul>
            <Tabs2 id="action-type" className="p-t-md">
              <Tab2 id="press" title="Key Editor" panel={(
                <div>
                  <HotkeyInput keyReport={keyReport} />
                  <SingleKeyReportEditor keyReport={keyReport} style={{ paddingTop: 20 }} />
                </div>)} />
              <Tab2 id="macro" title="Light Editor" />
              <Tabs2.Expander />
              <Button iconName="help" className="pt-intent-primary pt-minimal" />
              <Dialog iconName="help" isOpen={false} title="Help">
                <div className="pt-dialog-body">
                  <h5>Keypress</h5>
                  <p>The keypress setting sends a keydown when the switch is depressed,
                     and a keyup when the switch is released, just like a normal keyboard.
                  </p>
                  <h5>Text Expand</h5>
                  <p>After press and release, the switch will transmit the entire string.
                    Unicode is transmitted via unicode codes on windows.
                  </p>
                </div>
                <div className="pt-dialog-footer">
                  <div className="pt-dialog-footer-actions">
                    <Button
                      intent={Intent.PRIMARY}
                      text="OK"
                    />
                  </div>
                </div>
              </Dialog>
            </Tabs2>
          </div>
        </section>
      </div>
    );
  }
}
