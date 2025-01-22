import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

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

    @IsNumber()
    @IsOptional()
    @Min(2)
    @Max(100)
    maxMembers?: number;
} 