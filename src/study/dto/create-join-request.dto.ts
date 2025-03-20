import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJoinRequestDto {

    @ApiProperty({
        description: '참여 이유 및 가능한 시간',
        example: '평일 저녁 7시 이후, 주말 오전에 참여 가능합니다. 매주 10시간 정도 공부할 수 있습니다.'
    })
    @IsNotEmpty({ message: '참여 이유는 필수 입력 항목입니다.' })
    @IsString()
    reason!: string;

    @ApiProperty({
        description: '스터디를 통해 달성하고 싶은 목표',
        example: '타입스크립트의 기본 문법을 익히고 간단한 프로젝트를 완성하고 싶습니다.'
    })
    @IsNotEmpty({ message: '경험 및 목표는 필수 입력 항목입니다.' })
    @IsString()
    experience!: string;
}
