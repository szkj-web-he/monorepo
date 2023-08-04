import { useRef } from "react";

export default <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;

  return ref;
};
