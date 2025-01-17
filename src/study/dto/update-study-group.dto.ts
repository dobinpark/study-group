import { IsString, IsOptional } from 'class-validator';

export class UpdateStudyGroupDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    mainCategory?: string;

    @IsString()
    @IsOptional()
    subCategory?: string;

    @IsString()
    @IsOptional()
    detailCategory?: string;

    @IsString()
    @IsOptional()
    content?: string;
} 