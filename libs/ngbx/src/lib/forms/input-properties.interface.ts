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

export interface InputProperties {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;

  control: 'input' | 'checkbox' | 'radio' | 'select' | 'textarea';
  type: InputType;
  required: boolean;

  options?: any[];
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

export type CustomProperties = Partial<Pick<InputProperties,
  | 'label'
  | 'control'
  | 'placeholder'
  | 'description'
  | 'rows'
  //
>>;

export type Mapper = (props: InputProperties, ...constraints: any[]) => void;
