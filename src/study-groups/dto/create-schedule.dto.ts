import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsEnum(['online', 'offline'])
  meetingType: 'online' | 'offline';

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;
}
