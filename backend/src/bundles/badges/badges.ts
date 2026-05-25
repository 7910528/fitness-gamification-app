import { logger } from '~/common/logger/logger.js';

import { BadgeController } from './badge.controller.js';
import { BadgeModel } from './badge.model.js';
import { BadgeRepository } from './badge.repository.js';
import { BadgeService } from './badge.service.js';

const badgeRepository = new BadgeRepository(BadgeModel);
const badgeService = new BadgeService(badgeRepository);
const badgeController = new BadgeController(logger, badgeService);

export { badgeController, badgeRepository, badgeService };
export { BadgeController } from './badge.controller.js';
export { BadgeModel } from './badge.model.js';
export { BadgeRepository } from './badge.repository.js';
export { BadgeService } from './badge.service.js';
