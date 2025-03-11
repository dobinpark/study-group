import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { SupportCategory } from '../enum/support-category.enum'; // PostCategory -> SupportCategory 로 Enum 변경

export class CreateSupportDto { // 클래스 이름 변경
    @IsString()
    @IsNotEmpty({ message: '제목은 필수입니다.' })
    title!: string;

    @IsString()
    @IsNotEmpty({ message: '내용은 필수입니다.' })
    content!: string;

    @IsEnum(SupportCategory) // PostCategory -> SupportCategory 로 Enum 변경
    @IsNotEmpty({ message: '게시판 종류를 선택해주세요.' }) // message 수정
    category!: SupportCategory; // PostCategory -> SupportCategory 로 변경
} 