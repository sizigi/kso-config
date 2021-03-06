import * as classNames from 'classNames';
import * as React from 'react';
import { AppStore } from '../store';
import { HotkeyInput } from './hotkey';
import { MacrokeyInput } from './macrokey';
import { LightEditor } from './lighteditor';
import { MenuSelect } from './menuselect';
import { observer } from 'mobx-react';
import { SingleKeyReportEditor } from './singlekeyreporteditor';

import {
  NonIdealState,
  Button,
  EditableText,
  Intent,
  Position,
  Dialog,
  Tab2,
  Tabs2,
  Tooltip,
} from '@blueprintjs/core';

@observer
export class DevicePanel extends React.Component<{ appStore: AppStore }, Readonly<any>> {
  render() {
    const { appStore } = this.props;

    let element: JSX.Element;

    if (appStore.selectedDevice !== null && appStore.selectedDevice.loading !== true) {
      element = <div>
        <div id='title-bar' />
        <div style={{ padding: 20, paddingTop: 0 }}>
          <Button
            style={{ float: 'right' }}
            text='Save'
            onClick={appStore.selectedDevice.save_data.bind(appStore.selectedDevice)}
            iconName='floppy-disk'
            className={classNames('pt-button', 'pt-large', 'pt-intent-primary')} />
          <h1>
            <EditableText placeholder='Click to name...' maxLength={32} />
          </h1>
          <ul className='pt-list-unstyled'>
            <li>
              <Tooltip content='On-chip Hardware ID' intent={Intent.PRIMARY} position={Position.LEFT}>
                <strong>Serial:&nbsp;</strong>
              </Tooltip>
              <span>{appStore.selectedDevice.serial}</span>
            </li>
            <li>
              <Tooltip content='Current device firmware' intent={Intent.PRIMARY} position={Position.LEFT}>
                <strong>Firmware:&nbsp;</strong>
              </Tooltip>
              <span>{appStore.selectedDevice.firmware}</span>
            </li>
            <li><strong>I<sup>2</sup>C Address:&nbsp;</strong>
              <EditableText placeholder='Address' defaultValue='0x4F' />
            </li>
            <li>
              <strong>Key Mode:&nbsp;</strong>
              <MenuSelect header='Set Key Mode'
                value={appStore.selectedDevice.keyMode}
                options={[
                  { name: 'Keypress', icon: 'pt-icon-new-text-box', value: 'keypress' },
                  { name: 'Macro', icon: 'pt-icon-calculator', value: 'macro' },
                  { name: 'Morse', icon: 'pt-icon-group-objects', value: 'morse' },
                  { name: 'None', icon: 'pt-icon-disable', value: 'none' },
                ]} />
            </li>
            <li>
              <strong>Light Mode:&nbsp;</strong>
              <MenuSelect header='Set Key Mode'
                value={appStore.selectedDevice.lightMode}
                options={[
                  { name: 'Onboard RGB', icon: 'pt-icon-settings', value: 'rgb' },
                  { name: 'Soldered LED', icon: 'pt-icon-flash', value: 'led' },
                  { name: 'Off', icon: 'pt-icon-disable', value: 'none' },
                ]} />
            </li>
          </ul>
          <Tabs2 id='action-type' className='p-t-md' defaultSelectedTabId='key'>
            <Tab2 id='key' title='Key Editor' panel={
              <div>
                {appStore.selectedDevice.keyMode.get() === 'keypress' ?
                  <div>
                    <HotkeyInput keyReport={appStore.selectedDevice.config.keyreport} />
                    <SingleKeyReportEditor keyReport={appStore.selectedDevice.config.keyreport} style={{ paddingTop: 20 }} />
                  </div>
                  : undefined}
                {appStore.selectedDevice.keyMode.get() === 'none' ?
                  <NonIdealState className='p-t-md' visual='pt-icon-disable' title='Key Action Off' />
                  : undefined}
                {appStore.selectedDevice.keyMode.get() === 'macro' ?
                  <MacrokeyInput />
                  : undefined}
              </div>} />
            <Tab2 id='light' title='Light Editor' panel={<LightEditor appStore={appStore} />} />
            <Tabs2.Expander />
            <Button iconName='help' className='pt-intent-primary pt-minimal' />
            <Dialog iconName='help' isOpen={false} title='Help'>
              <div className='pt-dialog-body'>
                <h5>Keypress</h5>
                <p>The keypress setting sends a keydown when the switch is depressed,
                  and a keyup when the switch is released, just like a normal keyboard.
                </p>
                <h5>Text Expand</h5>
                <p>After press and release, the switch will transmit the entire string.
                  Unicode is transmitted via unicode codes on windows.
                </p>
              </div>
              <div className='pt-dialog-footer'>
                <div className='pt-dialog-footer-actions'>
                  <Button
                    intent={Intent.PRIMARY}
                    text='OK'
                  />
                </div>
              </div>
            </Dialog>
          </Tabs2>
        </div>
      </div>;
    } else {
      element = (<NonIdealState
        visual='pt-icon-calculator'
        action={this.props.appStore.warning
          ? (<div className='pt-callout pt-icon-info-sign'>
            <h5>Device Disconnected</h5>
            <span>The previously selected device is no longer detected.</span>
          </div>) : undefined}
      />);
    }

    return element;
  }

}