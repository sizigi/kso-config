import * as React from 'react';
import { IAppStoreProp } from '../../store';
import { LedColorPicker } from './colorpicker';

export class RgbLedEditor extends React.Component<IAppStoreProp, {}> {
  public render() {
    return (<div>
      <LedColorPicker
        label={<span>
          <span className='pt-icon-import' />
          <span>&nbsp;When Pressed</span>
        </span>}
      />
      <LedColorPicker
        label={<span>
          <span className='pt-icon-export' />
          <span>&nbsp;When Released</span>
        </span>}
      />
    </div>);
  }
}