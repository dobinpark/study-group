import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { SupportCategory } from '../enum/support-category.enum'; // PostCategory -> SupportCategory 로 Enum 변경

export class UpdateSupportDto { // 클래스 이름 변경
    @IsString()
    @IsNotEmpty({ message: '제목을 입력해주세요' })
    @MinLength(2, { message: '제목은 최소 2자 이상이어야 합니다' })
    @MaxLength(100, { message: '제목은 최대 100자까지 가능합니다' })
    title!: string;

    @IsString()
    @IsNotEmpty({ message: '내용을 입력해주세요' })
    @MinLength(2, { message: '내용은 최소 2자 이상이어야 합니다' })
    content!: string;

    @IsEnum(SupportCategory) // PostCategory -> SupportCategory 로 Enum 변경
    category?: SupportCategory; // PostCategory -> SupportCategory 로 변경, required 제거 (optional)
} 