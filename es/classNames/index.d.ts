type Value = string | number | boolean | undefined | null;
type Mapping = Record<string, unknown>;
type ArgumentArray = Array<Argument>;
type Argument = Value | Mapping | ArgumentArray;
type ClassNames = (...args: ArgumentArray) => string;
declare const classNames: ClassNames;

export { Argument, ArgumentArray, ClassNames, Mapping, Value, classNames as default };
