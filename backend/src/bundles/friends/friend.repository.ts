import {
    FOLLOWER_DETAILS_GRAPH,
    MAX_NUMBER_OF_USERS,
    USER_DETAILS_GRAPH,
} from '~/bundles/friends/constants/constants.js';
import {
    ErrorMessage,
    HttpCode,
    HttpError,
} from '~/bundles/friends/enums/enums.js';
import { FriendEntity } from '~/bundles/friends/friend.entity.js';
import { type FriendModel } from '~/bundles/friends/friend.model.js';
import { type FriendResponseDto } from '~/bundles/friends/types/types.js';
import { type LevelService } from '~/bundles/levels/levels.js';
import { type UserModel } from '~/bundles/users/user.model.js';
import { DatabaseTableName } from '~/common/database/database.js';
import { type Repository } from '~/common/types/types.js';

class FriendRepository implements Repository {
    private friendModel: typeof FriendModel;
    private userModel: typeof UserModel;
    private levelService: LevelService;

    public constructor(
        friendModel: typeof FriendModel,
        userModel: typeof UserModel,
        levelService: LevelService,
    ) {
        this.friendModel = friendModel;
        this.userModel = userModel;
        this.levelService = levelService;
    }

    public async find(
        query: Record<string, unknown>,
    ): Promise<FriendEntity | null> {
        const friend = await this.friendModel.query().findOne(query).execute();

        if (!friend) {
            return null;
        }

        return FriendEntity.initialize({
            ...friend,
        });
    }

    public create(): ReturnType<Repository['create']> {
        return Promise.resolve(true);
    }

    public async findAll(): Promise<FriendEntity[]> {
        const friends = await this.friendModel.query().execute();

        return friends.map((friend) => {
            return FriendEntity.initialize({
                ...friend,
            });
        });
    }

    public async findAllPotentialFollowings(
        userId: number,
        offset: string,
        limit: string,
        search?: string,
    ): Promise<FriendResponseDto[] | null> {
        const allUsers = await this.userModel
            .query()
            .whereNot('id', userId)
            .withGraphFetched(USER_DETAILS_GRAPH);

        const friends = await this.getFollowings(
            userId,
            '0',
            MAX_NUMBER_OF_USERS,
        );
        const followingIds = friends?.map((friend) => friend.userId) || [];

        let nonFriendUsers = allUsers.filter(
            (user) => !followingIds.includes(user.id) && user.id !== userId,
        );

        const normalizedSearch = search?.trim().toLowerCase();
        if (normalizedSearch) {
            nonFriendUsers = nonFriendUsers.filter((user) => {
                const fullName = user.userDetails?.fullName?.toLowerCase() ?? '';
                const username = user.userDetails?.username?.toLowerCase() ?? '';
                const email = user.email?.toLowerCase() ?? '';
                return (
                    fullName.includes(normalizedSearch) ||
                    username.includes(normalizedSearch) ||
                    email.includes(normalizedSearch)
                );
            });
        }

        const sliced = nonFriendUsers.slice(
            Number(offset),
            Number(offset) + Number(limit),
        );

        const paginatedUsers = await Promise.all(
            sliced.map(async (user) => {
                const { userDetails, id, email } = user;
                const level = await this.levelService.calculateLevel(
                    userDetails.bonusBalance,
                );
                return {
                    id,
                    userId: userDetails.userId,
                    email,
                    avatarUrl: userDetails.avatarUrl,
                    username: userDetails.username,
                    fullName: userDetails.fullName,
                    dateOfBirth: userDetails.dateOfBirth,
                    weight: userDetails.weight,
                    height: userDetails.height,
                    location: userDetails.location,
                    gender: userDetails.gender,
                    level,
                };
            }),
        );

        return paginatedUsers as FriendResponseDto[];
    }

    public async getFollowings(
        userId: number,
        offset: string,
        limit: string,
    ): Promise<FriendResponseDto[] | null> {
        const followings = await this.friendModel
            .query()
            .select(`${DatabaseTableName.USERS}.email`, 'followingId')
            .where(`${DatabaseTableName.FRIENDS}.userId`, userId)
            .withGraphFetched(USER_DETAILS_GRAPH)
            .join(
                DatabaseTableName.USERS,
                `${DatabaseTableName.USERS}.id`,
                `${DatabaseTableName.FRIENDS}.followingId`,
            )
            .orderBy(`${DatabaseTableName.FRIENDS}.id`)
            .offset(Number(offset))
            .limit(Number(limit));

        const result = await Promise.all(
            followings.map(async ({ id, userDetails, email }) => {
                const level = await this.levelService.calculateLevel(
                    userDetails.bonusBalance,
                );
                return {
                    id,
                    userId: userDetails.userId,
                    email,
                    avatarUrl: userDetails.avatarUrl,
                    username: userDetails.username,
                    fullName: userDetails.fullName,
                    dateOfBirth: userDetails.dateOfBirth,
                    weight: userDetails.weight,
                    height: userDetails.height,
                    location: userDetails.location,
                    gender: userDetails.gender,
                    level,
                };
            }),
        );
        return result as FriendResponseDto[];
    }

    public async addFollowing(
        id: number,
        followingId: number,
        offset: string,
    ): Promise<FriendResponseDto[] | null> {
        const trx = await this.userModel.startTransaction();

        const user = await this.userModel.query(trx).findById(id);
        if (!user) {
            throw new HttpError({
                message: ErrorMessage.FRIEND_NOT_FOUND,
                status: HttpCode.NOT_FOUND,
            });
        }

        await this.friendModel
            .query(trx)
            .insert({ userId: user.id, followingId })
            .returning('*')
            .first();

        const result = await this.findAllPotentialFollowings(id, offset, '1');

        await trx.commit();
        return result;
    }

    public async removeFollowing(
        id: number,
        followingId: number,
        offset: string,
    ): Promise<FriendResponseDto[] | null> {
        const trx = await this.userModel.startTransaction();

        const user = await this.userModel.query(trx).findById(id);

        if (!user) {
            throw new HttpError({
                message: ErrorMessage.FRIEND_NOT_FOUND,
                status: HttpCode.NOT_FOUND,
            });
        }

        await this.friendModel
            .query(trx)
            .where({ userId: user.id, followingId })
            .delete();

        const result = await this.getFollowings(id, offset, '1');

        await trx.commit();
        return result;
    }

    public async getFollowers(
        userId: number,
        offset: string,
        limit: string,
    ): Promise<FriendResponseDto[] | null> {
        const followers = await this.friendModel
            .query()
            .select(`${DatabaseTableName.USERS}.email`, 'userId')
            .where(`${DatabaseTableName.FRIENDS}.followingId`, userId)
            .withGraphFetched(FOLLOWER_DETAILS_GRAPH)
            .join(
                DatabaseTableName.USERS,
                `${DatabaseTableName.USERS}.id`,
                `${DatabaseTableName.FRIENDS}.userId`,
            )
            .orderBy(`${DatabaseTableName.FRIENDS}.id`)
            .offset(Number(offset))
            .limit(Number(limit));

        const friends = await this.getFollowings(
            userId,
            '0',
            MAX_NUMBER_OF_USERS,
        );
        const followingIds = friends?.map((friend) => friend.userId) || [];

        const followingMap: { [key: number]: boolean } = {};

        for (const id of followingIds) {
            followingMap[id] = true;
        }

        const result = await Promise.all(
            followers.map(async ({ followersDetails, email, userId }) => {
                const level = await this.levelService.calculateLevel(
                    followersDetails.bonusBalance,
                );
                return {
                    id: userId,
                    userId: userId,
                    email,
                    avatarUrl: followersDetails.avatarUrl,
                    username: followersDetails.username,
                    fullName: followersDetails.fullName,
                    dateOfBirth: followersDetails.dateOfBirth,
                    weight: followersDetails.weight,
                    height: followersDetails.height,
                    location: followersDetails.location,
                    gender: followersDetails.gender,
                    isFollowing: followingMap[userId] ? true : false,
                    level,
                };
            }),
        );
        return result as FriendResponseDto[];
    }

    public async update(
        query: Record<string, unknown>,
        payload: Record<string, unknown>,
    ): ReturnType<Repository['update']> {
        return this.friendModel
            .query()
            .patch(payload)
            .where(query)
            .returning('*')
            .first()
            .execute();
    }

    public delete(): ReturnType<Repository['delete']> {
        return Promise.resolve(true);
    }
}

export { FriendRepository };
