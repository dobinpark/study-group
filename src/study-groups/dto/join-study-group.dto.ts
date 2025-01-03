import { IsUUID } from 'class-validator';

export class JoinStudyGroupDto {
  @IsUUID()
  groupId: string;
}
