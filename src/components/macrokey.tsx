import * as React from 'react';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import { observable, computed, action, IObservableValue } from 'mobx';
import { MenuSelect } from './menuselect';
import { platform } from 'process';

type macromode = 'ASCII' | 'Unicode' | 'Invalid';
type osmode = 'win' | 'osx';

export class MacroData {

  @observable private _length: number;
  @observable private _data: string;
  @observable private _mode: macromode;

  @observable public os: IObservableValue<osmode>;

  constructor() {
    this.os = observable.box<osmode>(platform === 'darwin' ? 'osx' : 'win');
    this._mode = 'ASCII';
    this._length = 0;
    this._data = '';
  }

  @computed public get data(): string {
    return this._data;
  }

  public set data(macro: string) {
    this._mode = 'ASCII';
    this._length = 0;

    // normalize line endings
    macro.replace('\r\n', '\n');
    macro.replace('\r', '\n');

    for (const char of macro) {
      this._length++;
      const charCode = char.charCodeAt(0);

      if (char.length > 1 || charCode > 0xFFFF) {
        this._mode = 'Invalid';
        continue;
      }

      // specially handle newline and tab
      if (charCode === 0xA || charCode === 0x9) {
        continue;
      }

      // check other non-printable characters
      if (charCode < 0x20 || charCode > 0x7E) {
        console.log(charCode);
        this._mode = 'Unicode';
        continue;
      }
    }

    this._data = macro;
  }

  @computed public get limit(): number {
    switch (this.mode) {
      case 'ASCII':
        return 504;
      case 'Unicode':
        return 63;
      default:
        return 0;
    }
  }

  @computed public get mode(): macromode {
    return this._mode;
  }

  @computed public get length(): number {
    return this._length;
  }

  @computed public get valid(): boolean {
    return this.length <= this.limit;
  }
}

const md = new MacroData();

@observer
export class MacrokeyInput extends React.Component<{}, {}> {

  @action.bound
  private handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    md.data = event.target.value;
  }

  render() {
    return (<div className={classNames('pt-form-group', { 'pt-intent-danger': !md.valid })}>
      <div className='pt-form-content'>
        <textarea
          placeholder='Type macro text...'
          className={classNames('pt-input', 'pt-fill', { 'pt-intent-danger': !md.valid })}
          style={{ height: '150px' }}
          value={md.data}
          onChange={this.handleChange}
        ></textarea>
        <div className='pt-form-helper-text' style={{ textAlign: 'right' }}>
          {md.length}/{md.limit} Characters
          ({md.mode}
          {md.mode === 'Unicode' ?
            <span> <MenuSelect
              header='Unicode Input Method'
              value={md.os}
              options={[
                { name: 'Windows', icon: 'pt-icon-calculator', value: 'win' },
                { name: 'OSX', icon: 'pt-icon-key-option', value: 'osx' },
              ]}
            /></span> : null
          }
          )
        </div>
      </div>
    </div>
    );
  }
}