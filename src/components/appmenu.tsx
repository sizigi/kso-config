import * as React from 'react';
import { AppStore } from '../store';
import {
  Alert,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Position
  } from '@blueprintjs/core';


export class AppMenu extends React.Component<{appStore: AppStore}, {}> {
  public render() {
    return <Popover position={Position.BOTTOM_RIGHT}>
      <Button iconName="menu" className='pt-minimal'/>
      <Menu>
        <MenuItem text="Force Device Refresh" iconName="refresh" onClick={
          () => this.props.appStore.updateDevices()
        }/>
        <MenuItem text="Check for Updates" iconName="cloud"/>
        <MenuDivider />
        <MenuItem text="Check Manual" iconName="help" onClick={
          () => require('electron').shell.openExternal('http://keyswitch.one')
        }/>
      </Menu>
    </Popover>
  }
}
