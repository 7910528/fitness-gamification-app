import { type ValueOf } from '~/common/types/types.js';

import { UserBonusActionType } from './enums.js';

const BonusAmount: Record<ValueOf<typeof UserBonusActionType>, number> = {
    [UserBonusActionType.REGISTERED]: 50,
    [UserBonusActionType.INVITED]: 20,
    [UserBonusActionType.WORKOUT_COMPLETED]: 10,
    // ACHIEVEMENT_COMPLETED amount is variable and read from
    // the achievement.points column at runtime.
    [UserBonusActionType.ACHIEVEMENT_COMPLETED]: 0,
} as const;

export { BonusAmount };
