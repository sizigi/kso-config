declare module 'react-maskedinput-updated' {
  import { ComponentClass, HTMLAttributes } from "react";

  const MaskedInput: MaskedInput;
  type MaskedInput = ComponentClass<MaskedInput.MaskedInputProps>;

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
}

