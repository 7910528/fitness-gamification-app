import { type BadgeRecord, type BadgeRepository } from './badge.repository.js';

class BadgeService {
    private badgeRepository: BadgeRepository;

    public constructor(badgeRepository: BadgeRepository) {
        this.badgeRepository = badgeRepository;
    }

    public async findAll(): Promise<BadgeRecord[]> {
        return await this.badgeRepository.findAll();
    }

    public async findByUserId(userId: number): Promise<BadgeRecord[]> {
        return await this.badgeRepository.findByUserId(userId);
    }
}

export { BadgeService };
