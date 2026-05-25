import { createSlice } from '@reduxjs/toolkit';
import { type BadgeResponseDto } from 'shared';

import { DataStatus } from '~/bundles/common/enums/enums.js';
import { type ValueOf } from '~/bundles/common/types/types.js';

import { getBadgesByUserId } from './actions.js';

type State = {
    dataStatus: ValueOf<typeof DataStatus>;
    badges: BadgeResponseDto[];
};

const initialState: State = {
    dataStatus: DataStatus.IDLE,
    badges: [],
};

const { reducer, actions, name } = createSlice({
    initialState,
    name: 'badges',
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getBadgesByUserId.pending, (state) => {
            state.dataStatus = DataStatus.PENDING;
        });
        builder.addCase(getBadgesByUserId.fulfilled, (state, action) => {
            state.dataStatus = DataStatus.FULFILLED;
            state.badges = action.payload;
        });
        builder.addCase(getBadgesByUserId.rejected, (state) => {
            state.dataStatus = DataStatus.REJECTED;
        });
    },
});

export { type State, actions, name, reducer };
