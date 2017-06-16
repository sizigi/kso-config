declare module 'react-maskedinput-updated' {

  import { Component, HTMLAttributes } from "react";
  namespace MaskedInput {
    interface FormatCharacter {
      validate(char: string): boolean;
      transform?(char: string): string;
    }

    interface CharsFormatters {
      [char: string]: FormatCharacter;
    }

    interface MaskedInputProps extends HTMLAttributes<any> {
      mask: string;
      formatCharacters?: CharsFormatters;
      placeholderChar?: string;
    }
  }

  class MaskedInputComponent extends Component<MaskedInput.MaskedInputProps, {}> {}
  export = MaskedInputComponent;
}

