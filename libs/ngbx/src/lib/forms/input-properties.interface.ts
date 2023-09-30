// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types
export type InputType =
  // | 'button'
  // | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  // | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  // | 'reset'
  // | 'search'
  // | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
;

export interface InputProperties<T> {
  id: keyof T;
  /**
   * The primary label text for the form element.
   * If not set, it will be the property name.
   */
  label: string;
  /**
   * Input fields will show this while empty.
   * @see
   */
  placeholder?: string;
  /**
   * When set, this will appear as a "form-text" (gray small text) element below the input control.
   */
  description?: string;

  /**
   * The type of element for editing the value
   */
  control: 'input' | 'checkbox' | 'radio' | 'select' | 'textarea';
  type: InputType;
  required: boolean;

  options?: any[];
  /**
   * If options are specified and control is radio or select,
   * this will be used to display the values in a friendlier way.
   *
   * @example ```
   * @Presentation({
   *   optionNames: {'true': 'Yes', 'false': 'No'}
   * })
   * @IsBoolean()
   * ```
   *
   * @example ```
   * @Presentation({
   *   optionNames: {1: '1st', 2: '2nd', 3: '3rd'}
   * })
   * @IsIn([1, 2, 3])
   * ```
   */
  optionLabels?: Record<PropertyKey, string>;
  /**
   * For control=textarea, how many lines of text are typically used to display the value.
   * For control=radio, setting this to 1 makes the radio buttons display inline.
   */
  rows?: number;

  // number
  min: number | null;
  max: number | null;
  step: number | null;

  // text
  pattern: string | RegExp;
  minLength: number;
  maxLength: number;
}

export type CustomProperties<T> = Partial<Pick<InputProperties<T>,
  | 'label'
  | 'control'
  | 'placeholder'
  | 'description'
  | 'rows'
  | 'optionLabels'
  //
>>;

export type Mapper = <T>(props: InputProperties<T>, ...constraints: any[]) => void;

export interface ValidationFormOptions<T> {
  pick?: (keyof T)[];
  omit?: (keyof T)[];
}
