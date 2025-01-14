import { EntityRepository, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
    // 사용자 정의 메서드를 추가할 수 있습니다.
} 