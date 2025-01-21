import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateStudyGroupDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    mainCategory!: string;

    @IsNotEmpty()
    @IsString()
    subCategory!: string;

    @IsNotEmpty()
    @IsString()
    detailCategory!: string;

    @IsNotEmpty()
    @IsString()
    content!: string;

    @IsNumber()
    @Min(2)
    @Max(100)
    maxMembers!: number;
}
