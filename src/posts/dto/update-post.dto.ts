import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { PostCategory } from '../enum/post-category.enum';

export class UpdatePostDto {
    @IsString()
    @IsNotEmpty({ message: '제목을 입력해주세요' })
    @MinLength(2, { message: '제목은 최소 2자 이상이어야 합니다' })
    @MaxLength(100, { message: '제목은 최대 100자까지 가능합니다' })
    title!: string;

    @IsString()
    @IsNotEmpty({ message: '내용을 입력해주세요' })
    @MinLength(2, { message: '내용은 최소 2자 이상이어야 합니다' })
    content!: string;

    @IsEnum(PostCategory)
    category!: PostCategory;
}
