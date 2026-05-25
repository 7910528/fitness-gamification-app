import { AbstractModel, DatabaseTableName } from '~/common/database/database.js';

class LevelModel extends AbstractModel {
    public 'level': number;
    public 'requiredPoints': number;

    public static override get tableName(): string {
        return DatabaseTableName.LEVELS;
    }
}

export { LevelModel };
