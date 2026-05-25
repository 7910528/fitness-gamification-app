import { getLeaderboard } from './actions.js';
import { actions } from './slice.js';

const allActions = {
    ...actions,
    getLeaderboard,
};

export { allActions as actions };
export { reducer } from './slice.js';
