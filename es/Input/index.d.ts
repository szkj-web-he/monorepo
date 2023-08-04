import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onInput"> {
    width?: string;
    height?: string;
    disabled?: boolean;
    onChange?: (res: string) => void;
    value?: string;
    isError?: boolean;
    beforeNode?: React.ReactNode;
    afterNode?: React.ReactNode;
    hiddenClearIcon?: boolean;
    onEnter?: () => void;
    include?: Array<string> | RegExp;
}
interface InputEvents {
    focus: () => void;
    blur: () => void;
    clear: () => void;
    setValue: (value: string) => void;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<InputEvents | null>>;

export { InputEvents, Input as default };
