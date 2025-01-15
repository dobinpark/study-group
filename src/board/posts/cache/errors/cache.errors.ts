import { CacheErrorMessage } from '../constants/error-messages.constants';

export class CacheKeyError extends Error {
    constructor(message: CacheErrorMessage) {
        const name = 'CacheKeyError';
        super(typeof message === 'function' ? message(name) : message);
        this.name = name;
    }
}
