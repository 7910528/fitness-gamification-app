import { createSlice } from '@reduxjs/toolkit';
import { type LeaderboardItemDto } from 'shared';

import { DataStatus } from '~/bundles/common/enums/enums.js';
import { type ValueOf } from '~/bundles/common/types/types.js';

import { getLeaderboard } from './actions.js';

type State = {
    dataStatus: ValueOf<typeof DataStatus>;
    loadMoreDataStatus: ValueOf<typeof DataStatus>;
    items: LeaderboardItemDto[];
    totalCount: number;
    currentUserRank: number | null;
};

const initialState: State = {
    dataStatus: DataStatus.IDLE,
    loadMoreDataStatus: DataStatus.IDLE,
    items: [],
    totalCount: 0,
    currentUserRank: null,
};

const { reducer, actions, name } = createSlice({
    initialState,
    name: 'leaderboards',
    reducers: {
        resetLeaderboard(state) {
            state.items = [];
            state.totalCount = 0;
            state.currentUserRank = null;
            state.dataStatus = DataStatus.IDLE;
            state.loadMoreDataStatus = DataStatus.IDLE;
        },
    },
    extraReducers(builder) {
        builder.addCase(getLeaderboard.pending, (state, action) => {
            if (action.meta.arg.page === 1) {
                state.dataStatus = DataStatus.PENDING;
            } else {
                state.loadMoreDataStatus = DataStatus.PENDING;
            }
        });
        builder.addCase(getLeaderboard.fulfilled, (state, action) => {
            state.dataStatus = DataStatus.FULFILLED;
            state.loadMoreDataStatus = DataStatus.FULFILLED;
            state.totalCount = action.payload.totalCount;
            state.currentUserRank = action.payload.currentUserRank;
            state.items =
                action.meta.arg.page === 1
                    ? action.payload.items
                    : [...state.items, ...action.payload.items];
        });
        builder.addCase(getLeaderboard.rejected, (state) => {
            state.dataStatus = DataStatus.REJECTED;
            state.loadMoreDataStatus = DataStatus.REJECTED;
        });
    },
});

export { type State, actions, name, reducer };
