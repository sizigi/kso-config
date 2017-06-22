import * as React from 'react';
import DevTools from 'mobx-react-devtools';
import { ipcRenderer } from 'electron';
import { Provider, observer } from 'mobx-react';
import { action } from 'mobx';
import {
  Colors,
  FocusStyleManager,
} from '@blueprintjs/core';

import {AppStore} from './store';
import {DeviceList} from './components/devicelist'
import {DevicePanel} from './components/devicepanel'
import {AppMenu} from './components/appmenu'

FocusStyleManager.onlyShowFocusOnTabs();

@observer
export class App extends React.Component<undefined, undefined> {
  private appStore: AppStore;

  constructor() {
    super()
    ipcRenderer.on('usb:change', this.onUsbChange);
    this.appStore = new AppStore();
    this.appStore.updateDevices();
  }

  @action.bound
  private onUsbChange(): void {
    this.appStore.updateDevices();
  }

  render() {
    return (
      <Provider appStore={this.appStore}>
        <div
          style={{
            backgroundColor: Colors.LIGHT_GRAY5,
            height: '100vh',
            display: 'flex',
          }}>
          <DevTools />
          <nav style={{ flex: 1, backgroundColor: Colors.LIGHT_GRAY1, height: '100vh' }}>
            <div className='pt-navbar pt-dark kso-navbar'>
              <div className="pt-navbar-group pt-align-left">
                <div className="pt-navbar-heading pt-text-muted">keyswitch.one</div>
              </div>
              <div className="pt-navbar-group pt-align-right">
                <AppMenu appStore={this.appStore}/>
              </div>
            </div>
            <div style={{ height: 'calc(100vh - 75px)' }} data-simplebar>
              <DeviceList appStore={this.appStore}/>
            </div>
          </nav>

          <section style={{ flex: 2 }}>
            <DevicePanel appStore={this.appStore} />
          </section>
        </div>
      </Provider>
    );
  }
}
