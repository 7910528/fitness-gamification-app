import { getBadgesByUserId } from './actions.js';
import { actions } from './slice.js';

const allActions = {
    ...actions,
    getBadgesByUserId,
};

export { allActions as actions };
export { reducer } from './slice.js';
