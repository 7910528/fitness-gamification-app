import { type LevelRecord, type LevelRepository } from './level.repository.js';

const DEFAULT_LEVEL = 1;
const CACHE_TTL_MS = 5 * 60 * 1000;

class LevelService {
    private levelRepository: LevelRepository;
    private cache: LevelRecord[] | null = null;
    private cacheLoadedAt = 0;

    public constructor(levelRepository: LevelRepository) {
        this.levelRepository = levelRepository;
    }

    private async getLevels(): Promise<LevelRecord[]> {
        const isFresh =
            this.cache !== null &&
            Date.now() - this.cacheLoadedAt < CACHE_TTL_MS;

        if (!isFresh) {
            this.cache = await this.levelRepository.findAll();
            this.cacheLoadedAt = Date.now();
        }

        return this.cache ?? [];
    }

    public async calculateLevel(bonusBalance: number | null): Promise<number> {
        const points = Number(bonusBalance ?? 0);
        const levels = await this.getLevels();

        if (levels.length === 0) {
            return DEFAULT_LEVEL;
        }

        let current = levels[0].level;
        for (const entry of levels) {
            if (points >= entry.requiredPoints) {
                current = entry.level;
            } else {
                break;
            }
        }
        return current;
    }
}

export { LevelService };
