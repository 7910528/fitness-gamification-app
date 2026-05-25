import { LevelModel } from './level.model.js';
import { LevelRepository } from './level.repository.js';
import { LevelService } from './level.service.js';

const levelRepository = new LevelRepository(LevelModel);
const levelService = new LevelService(levelRepository);

export { LevelModel } from './level.model.js';
export { LevelRepository } from './level.repository.js';
export { LevelService } from './level.service.js';
export { levelRepository, levelService };
