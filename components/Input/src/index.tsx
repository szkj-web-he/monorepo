/**
 * @file 带有清空按钮的输入框
 * @date 2023-06-07
 * @author xuejie.he
 * @lastModify xuejie.he 2023-06-07
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Icon, useLatest, classNames } from "test_lib2";
import styles from "./style.module.scss";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onInput"
  > {
  /**
   * width of current component
   */
  width?: string;
  /**
   * height of current component
   */
  height?: string;
  /**
   * disabled of this component
   */
  disabled?: boolean;
  /**
   * 当输入框的值发生变化时
   */
  onChange?: (res: string) => void;
  /**
   * 输入框的值
   */
  value?: string;
  /**
   * 当前输入框是否输入有误
   */
  isError?: boolean;
  /**
   * 在输入框之前添加节点
   */
  beforeNode?: React.ReactNode;
  /**
   * 在输入框之后添加节点
   */
  afterNode?: React.ReactNode;
  /**
   * 是否隐藏清除按钮
   */
  hiddenClearIcon?: boolean;

  /**
   * 当用户按下enter的时候
   */
  onEnter?: () => void;

  /**
   * 限制数字输入的时候的白名单
   *  * 默认剔除了所有特殊字符、中文、英文
   */
  include?: Array<string> | RegExp;
}

export interface InputEvents {
  /**
   * 获焦
   * @returns
   */
  focus: () => void;
  /**
   * 失焦
   * @returns
   */
  blur: () => void;
  /**
   * 清空
   */
  clear: () => void;
  /**
   * 改变input的值
   */
  setValue: (value: string) => void;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Input = forwardRef<InputEvents | null, InputProps>(
  (
    {
      width,
      height,
      defaultValue,
      disabled = false,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      className,
      hiddenClearIcon = false,
      style,
      isError,
      value,
      beforeNode,
      afterNode,
      type = "text",
      onCompositionStart,
      onCompositionEnd,
      include,
      onEnter,
      ...props
    },
    events
  ) => {
    Input.displayName = "Input";
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const cRef = useRef<null | HTMLInputElement>(null);

    const [hover, setHover] = useState(false);

    const [focus, setFocus] = useState(false);

    const [val, setVal] = useState(value);
    /**
     * 在输入非英文的时候临时存储下来的input值
     */
    const compositionVal = useRef<string>();
    /**
     * 是否正在执行 输入合成阶段
     */
    const isComposition = useRef(false);

    /**
     * defaultValue变化的次数
     */
    const defaultValueChangeCount = useRef(0);

    /**
     * 最新的default value
     */
    const defaultValueRef = useLatest(defaultValue);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
      if (defaultValueChangeCount.current) {
        setVal(value);
        if (cRef.current) {
          cRef.current.value = value ?? "";
        }
      } else if (!defaultValueRef.current) {
        setVal(value);
        if (cRef.current) {
          cRef.current.value = value ?? "";
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
      ++defaultValueChangeCount.current;
    }, [defaultValue]);

    useEffect(() => {
      return () => {
        defaultValueChangeCount.current = 0;
      };
    }, []);

    useImperativeHandle(events, () => {
      return {
        focus: () => {
          cRef.current?.focus();
        },
        blur: () => {
          cRef.current?.blur();
        },
        clear: () => {
          setVal(undefined);
          onChange?.("");
          if (cRef.current) {
            cRef.current.value = "";
          }
        },
        setValue: (value: string) => {
          setVal(value);
          onChange?.(value);
          if (cRef.current) {
            cRef.current.value = value;
          }
        },
      };
    });
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    /**
     * 匹配特殊字符
     */
    const MatchSpecialChar = (keyVal: string) => {
      let exclude = [
        " ",
        ".",
        "-",
        "_",
        "/",
        "",
        "+",
        "*",
        "=",
        "(",
        ")",
        "&",
        "^",
        "%",
        "$",
        "#",
        "@",
        "!",
        "~",
        "`",
        ",",
        "?",
        "<",
        ">",
        "{",
        "}",
        "[",
        "]",
        "|",
        ":",
        ";",
        "'",
        '"',
        "\\",
        "……",
        "！",
        "￥",
        "（",
        "）",
        "——",
        "【",
        "】",
        "《",
        "》",
        "？",
        "、",
        "。",
        "，",
        "·",
        "‘",
        "”",
        "“",
        "’",
      ];
      if (include) {
        const arr: string[] = [];
        for (let i = 0; i < exclude.length; i++) {
          const item = exclude[i];
          if (
            Array.isArray(include) &&
            include.length &&
            include.includes(item)
          ) {
            // 匹配到了对应的字符串
          } else if (include instanceof RegExp && include.test(item)) {
            include.lastIndex = 0;
            //正则匹配到了对应的字符
          } else {
            arr.push(item);
          }
        }

        exclude = arr;
      }
      /**
       * 过滤特殊字符
       */
      if (exclude.some((item) => item === keyVal)) {
        return true;
      }

      return false;
    };

    /**
     * 阻止单词的输入
     */
    const preventWordEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const keyVal = e.key;
      if (
        /^[a-z]$/gi.test(keyVal) &&
        e.ctrlKey === false &&
        e.altKey === false
      ) {
        if (include instanceof RegExp && include.test(keyVal)) {
          return;
        }

        e.preventDefault();
        return;
      }
    };

    /**
     * 过滤数字
     */
    const filterKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const status = MatchSpecialChar(e.key);
      if (status) {
        e.preventDefault();
        return;
      }

      preventWordEnter(e);
    };

    /**
     * 当输入框改变时
     */
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value.trim();
      if (isComposition.current) {
        return;
      }

      setVal(val);
      onChange?.(val);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
      <div
        style={Object.assign({}, { width, height }, style)}
        className={classNames(styles.input_wrapper, className, {
          [styles.input_disabled]: disabled,
          [styles.input_active]: focus,
          [styles.input_noClear]: hiddenClearIcon,
          [styles.input_error]: isError,
        })}
        onMouseEnter={() => {
          if (!disabled) {
            setHover(true);
          }
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        {beforeNode}
        {/* <------------------------------------ **** SECTION1 START **** ------------------------------------ */}
        <input
          type={"text"}
          onKeyDown={(e) => {
            onKeyDown?.(e);

            /**
             * 限制只能输入数字
             */
            const keyVal = e.key;

            if (keyVal === "Escape") {
              cRef.current?.blur();
            }

            if (keyVal === "Enter") {
              onEnter?.();
            }

            if (type === "number") {
              filterKeydown(e);
            }
          }}
          onCompositionStart={(e) => {
            onCompositionStart?.(e);

            if (type === "number") {
              compositionVal.current = e.currentTarget.value;
            }
            isComposition.current = true;
          }}
          onCompositionEnd={(e) => {
            onCompositionEnd?.(e);
            if (type === "number") {
              e.currentTarget.value = compositionVal.current ?? "";
              compositionVal.current = undefined;
            }
            isComposition.current = false;
            const val = e.currentTarget.value.trim();
            setVal(val);
            onChange?.(val);
          }}
          ref={cRef}
          style={{ lineHeight: height }}
          onChange={handleValueChange}
          defaultValue={defaultValue}
          disabled={disabled}
          className={styles.input_main}
          onFocus={(e) => {
            onFocus?.(e);
            setFocus(true);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            setFocus(false);
          }}
          {...props}
        />
        {hiddenClearIcon ? (
          <></>
        ) : (
          <Icon
            type="empty"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            className={classNames(styles.input_clearIcon, {
              [styles.input_active]: val && (hover || focus),
            })}
            onClick={() => {
              if (disabled) {
                return;
              }

              if (cRef.current) {
                cRef.current.value = "";
                setVal(undefined);
                onChange?.("");
                cRef.current.focus();
              }
            }}
          />
        )}
        {afterNode}
        {/* <------------------------------------ **** SECTION1 END **** ------------------------------------ */}
      </div>
    );
  }
);
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
Input.displayName = "Input";
export default Input;
