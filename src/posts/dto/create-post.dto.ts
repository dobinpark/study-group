import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { PostCategory } from '../enum/post-category.enum';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty({ message: '제목은 필수입니다.' })
    title!: string;

    @IsString()
    @IsNotEmpty({ message: '내용은 필수입니다.' })
    content!: string;

    @IsEnum(PostCategory)
    @IsNotEmpty({ message: '게시판 종류를 선택해주세요.' })
    category!: PostCategory;

    @IsNumber()
    authorId: number;
} 