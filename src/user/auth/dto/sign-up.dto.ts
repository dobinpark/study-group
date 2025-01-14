import { IsEmail, IsString, MinLength } from 'class-validator';
import { ValidationMessages } from '../../../common/validation/validation-messages';

export class SignUpDto {
  @IsEmail({}, { message: ValidationMessages.isEmail })
  email: string;

  @IsString({ message: ValidationMessages.isString })
  @MinLength(2, { message: ValidationMessages.minLength })
  username: string;

  @IsString({ message: ValidationMessages.isString })
  @MinLength(6, { message: ValidationMessages.minLength })
  password: string;
}
