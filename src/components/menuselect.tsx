import * as React from 'react';
import { IObservableValue, computed } from 'mobx';
import {
  Menu,
  MenuItem,
  Popover,
  Position
} from '@blueprintjs/core';
import { observer } from 'mobx-react';

export interface IMenuSelectProps<T> {
  header: string;
  options: Array<{ name: string, icon?: string, value: T }>;
  value: IObservableValue<T>;
}

@observer
export class MenuSelect<T extends number | string> extends React.Component<IMenuSelectProps<T>, Readonly<any>> {

  @computed
  private get getLabelName(): string {
    const curVal = this.props.value.get();
    const opt = this.props.options.find((opt) => opt.value == curVal);
    return opt ? opt.name : 'Select Value...';
  }

  render() {
    let menuItems = this.props.options.map((opt) =>
      <MenuItem
        key={opt.value}
        text={opt.name}
        iconName={opt.icon}
        onClick={() => this.props.value.set(opt.value)} />
    );

    return (
      <Popover position={Position.BOTTOM_RIGHT}>
        <a tabIndex={0}>
          <span>{this.getLabelName}</span>
          <span className='pt-icon-caret-down' />
        </a>
        <Menu>
          <li className='pt-menu-header'>
            <h6>{this.props.header}</h6>
          </li>
          {menuItems}
        </Menu>
      </Popover>
    );
  }
}