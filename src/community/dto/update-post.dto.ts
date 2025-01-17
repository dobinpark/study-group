import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PostCategory } from '../enum/post-category.enum';

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsEnum(PostCategory)
    @IsOptional()
    category?: PostCategory;
} 