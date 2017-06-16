import * as React from 'react';
// import * as MaskedInput from 'react-maskedinput-updated';
import MaskedInput = require('react-maskedinput-updated');
import * as classNames from 'classnames';

function byteArrayToString(data: Uint8Array): string {
  return Array.prototype.map.call(data, (x: number) => ('00' + x.toString(16)).slice(-2)).join(' ');
}

function stringToByteArray(data: string): Uint8Array {
  let rv = [], bytestr : string;
  let str = data.replace(/ /g, '');
  while (str.length >= 2) {
    [bytestr, str] = [str.substr(0, 2), str.substr(2)];
    rv.push(parseInt(bytestr, 16));
  }
  return new Uint8Array(rv);
}

export interface IByteInputProps {
  value: Uint8Array;
  onChange?(data: Uint8Array) : void;
  style? : any;
}

export interface IByteInputState {
  valid: boolean;
}

export class ByteInput extends React.Component<IByteInputProps, IByteInputState> {
  constructor(props: IByteInputProps) {
    super(props);
    this.state = {
      valid: true,
    }
  }

  public componentWillReceiveProps() {
    this.setState({valid: true});
  }


  private updateState(value: string) {
    const clean = value.replace(/ /g, '');
    const valid = /^[0-9a-fA-F]{16}$/.test(clean);

    this.setState({
      valid: valid,
    });

    if(valid && this.props.onChange) {
      this.props.onChange(stringToByteArray(clean));
    }
  }

  private handleInputChange(event: React.SyntheticEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    this.updateState(value);
  }

  public render() {
    return (
      <MaskedInput
        style={this.props.style}
        className={classNames('pt-input', 'pt-monospace-text', 'pt-fill', { 'pt-intent-danger': !this.state.valid })}
        mask="XX XX XX XX XX XX XX XX"
        value={byteArrayToString(this.props.value)}
        onChange={this.handleInputChange.bind(this)}
        placeholderChar="_"
        formatCharacters={{
          'X': {
            validate(char) { return /[0-9a-fA-F]/.test(char) },
            transform(char) { return char.toUpperCase() }
          }
        }}
      />
    )
  }

}