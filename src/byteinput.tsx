import * as React from 'react';
import * as MaskedInput from 'react-maskedinput';
import * as classNames from 'classnames';

export interface IByteInputState {
  valid: boolean;
}

export class ByteInput extends React.Component<{}, IByteInputState> {
  constructor() {
    super();
    this.state = {
      valid: true,
    }
  }

  private updateState(value: string) {
    const clean = value.replace(/ /g, '');
    const valid = /^[0-9a-fA-F]{16}$/.test(clean);

    this.setState({valid: valid});
  }

  private handleInputChange(event: React.SyntheticEvent<HTMLInputElement>) {
    const value = event.currentTarget.value; 
    this.updateState(value);
  }

  public render() {
    return (
      <MaskedInput
        className={classNames('pt-input', {'pt-intent-danger': !this.state.valid})}
        mask="XX XX XX XX XX XX XX XX"
        value="00 00 00 00 00 00 00 00"
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