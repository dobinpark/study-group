import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ValidationMessages } from '../../../common/validation/validation-messages';

export class SearchPostDto {
  @IsString({ message: ValidationMessages.isString })
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty })
  @MinLength(2, { message: ValidationMessages.minLength })
  q: string;
}
