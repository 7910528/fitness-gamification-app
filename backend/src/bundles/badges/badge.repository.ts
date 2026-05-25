import { DatabaseTableName } from '~/common/database/database.js';

import { type BadgeModel } from './badge.model.js';

type BadgeRecord = {
    id: number;
    url: string;
    achievementId: number;
    achievementName?: string;
    createdAt?: string;
};

class BadgeRepository {
    private badgeModel: typeof BadgeModel;

    public constructor(badgeModel: typeof BadgeModel) {
        this.badgeModel = badgeModel;
    }

    public async findAll(): Promise<BadgeRecord[]> {
        const badges = await this.badgeModel.query().execute();
        return badges.map((badge) => ({
            id: badge.id,
            url: badge.url,
            achievementId: badge.achievementId,
        }));
    }

    public async findByUserId(userId: number): Promise<BadgeRecord[]> {
        const badges = await this.badgeModel
            .query()
            .join(
                DatabaseTableName.USER_ACHIEVEMENTS,
                `${DatabaseTableName.BADGES}.achievementId`,
                `${DatabaseTableName.USER_ACHIEVEMENTS}.achievementId`,
            )
            .join(
                DatabaseTableName.ACHIEVEMENTS,
                `${DatabaseTableName.ACHIEVEMENTS}.id`,
                `${DatabaseTableName.BADGES}.achievementId`,
            )
            .where(`${DatabaseTableName.USER_ACHIEVEMENTS}.userId`, userId)
            .select(
                `${DatabaseTableName.BADGES}.id`,
                `${DatabaseTableName.BADGES}.url`,
                `${DatabaseTableName.BADGES}.achievementId`,
                `${DatabaseTableName.ACHIEVEMENTS}.name as achievementName`,
                `${DatabaseTableName.USER_ACHIEVEMENTS}.createdAt as createdAt`,
            )
            .orderBy(
                `${DatabaseTableName.USER_ACHIEVEMENTS}.createdAt`,
                'desc',
            );

        return badges as unknown as BadgeRecord[];
    }
}

export { BadgeRepository, type BadgeRecord };
