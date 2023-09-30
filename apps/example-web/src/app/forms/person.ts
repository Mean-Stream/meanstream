import {
  Equals,
  IsBoolean,
  IsDivisibleBy,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {Presentation} from '@meanstream/ngbx';

export enum Gender {
  MALE = 'm',
  FEMALE = 'f',
  DIVERSE = 'd',
}

export class Person {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber()
  phone!: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @Presentation({
    control: 'textarea',
    description: 'Write something about yourself',
  })
  @IsString()
  bio?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  age!: number;

  @IsEnum(Gender)
  gender!: Gender;

  @IsIn(['online', 'sleeping', 'do-not-disturb', 'invisible', 'offline'])
  status!: string;

  @Presentation({
    control: 'radio',
    rows: 1,
  })
  @IsIn([1, 2, 3, 4, 5])
  rating!: number;

  @IsNumber()
  @IsDivisibleBy(0.01)
  balance!: number;

  @Presentation({
    placeholder: 'I want to receive emails about new products',
  })
  @IsBoolean()
  adEmailConsent!: boolean;

  @Presentation({
    placeholder: 'I have read and agree to the terms and conditions',
  })
  @IsBoolean()
  @Equals(true)
  tosAccepted!: true;
}
