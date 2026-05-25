import { type LevelModel } from './level.model.js';

type LevelRecord = {
    id: number;
    level: number;
    requiredPoints: number;
};

class LevelRepository {
    private levelModel: typeof LevelModel;

    public constructor(levelModel: typeof LevelModel) {
        this.levelModel = levelModel;
    }

    public async findAll(): Promise<LevelRecord[]> {
        const result = await this.levelModel
            .query()
            .orderBy('level', 'asc')
            .execute();
        return result.map((it) => ({
            id: it.id,
            level: it.level,
            requiredPoints: it.requiredPoints,
        }));
    }
}

export { LevelRepository, type LevelRecord };
