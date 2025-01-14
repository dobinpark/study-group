import { IsString, IsNotEmpty } from 'class-validator';
import { ValidationMessages } from '../../../common/validation/validation-messages';

export class CreatePostDto {
  @IsString({ message: ValidationMessages.isString })
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty })
  title: string;

  @IsString({ message: ValidationMessages.isString })
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty })
  content: string;
}
