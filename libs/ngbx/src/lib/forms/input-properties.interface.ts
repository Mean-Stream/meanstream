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
   * For control=textarea, how many lines of text are typically used to display the value
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
  //
>>;

export type Mapper = <T>(props: InputProperties<T>, ...constraints: any[]) => void;

export interface ValidationFormOptions<T> {
  pick?: (keyof T)[];
  omit?: (keyof T)[];
}
