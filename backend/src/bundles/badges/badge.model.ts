import { type RelationMappings, Model } from 'objection';

import { AchievementModel } from '~/bundles/achievements/achievement.model.js';
import {
    AbstractModel,
    DatabaseTableName,
} from '~/common/database/database.js';

class BadgeModel extends AbstractModel {
    public 'url': string;
    public 'achievementId': number;
    public 'achievement': AchievementModel;

    public static override get tableName(): string {
        return DatabaseTableName.BADGES;
    }

    public static override get relationMappings(): RelationMappings {
        return {
            achievement: {
                relation: Model.BelongsToOneRelation,
                modelClass: AchievementModel,
                join: {
                    from: `${DatabaseTableName.BADGES}.achievementId`,
                    to: `${DatabaseTableName.ACHIEVEMENTS}.id`,
                },
            },
        };
    }
}

export { BadgeModel };
