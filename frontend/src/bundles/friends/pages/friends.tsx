import { Loader } from '~/bundles/common/components/components.js';
import { DataStatus } from '~/bundles/common/enums/enums.js';
import { getValidClassNames } from '~/bundles/common/helpers/helpers.js';
import {
    useAppDispatch,
    useAppSelector,
    useCallback,
    useEffect,
    useRef,
    useState,
} from '~/bundles/common/hooks/hooks.js';
import {
    FriendDetails,
    TabContent,
    Tabs,
} from '~/bundles/friends/components/components.js';
import {
    LIMIT,
    PAGE,
    ROW_LENGTH,
    TabsFollowers,
} from '~/bundles/friends/constants/constants.js';
import { actions as friendsActions } from '~/bundles/friends/store/friends.js';
import { type FriendResponseDto } from '~/bundles/friends/types/types.js';

const Friends: React.FC = () => {
    const dispatch = useAppDispatch();
    const tabs = [
        TabsFollowers.FOLLOWINGS,
        TabsFollowers.FIND_FOLLOWINGS,
        TabsFollowers.FOLLOWERS,
    ];
    const [page, setPage] = useState<number>(PAGE);
    const [search, setSearch] = useState<string>('');
    const debounceReference = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const [selectedCard, setSelectedCard] = useState<FriendResponseDto | null>(
        null,
    );
    const [activeTab, setActiveTab] = useState<string>(
        TabsFollowers.FOLLOWINGS,
    );

    const {
        users,
        dataStatus: isLoading,
        loadMoreDataStatus: isLoadingMore,
        totalCount,
        followers,
    } = useAppSelector(({ friends }) => friends);

    const classes = {
        detailsAside:
            'bg-secondary border-secondary fixed right-[6px] top-[88px] ml-4 flex h-full w-full flex-col border-l-2 pb-4 pl-4 pr-4 pt-8 transition duration-500 md:max-w-[254px] lg:max-w-[354px] transform translate-x-0',
        table: 'relative grid grid-cols-[repeat(auto-fit,minmax(215px,1fr))] gap-5 pb-8',
        row: 'relative gap-5 pb-8 flex',
        hidden: 'translate-x-[200%]',
        animation: 'transition-transform duration-[0.5s] ease-[ease-in-out]',
    };

    useEffect(() => {
        void dispatch(friendsActions.getFollowings({}));
    }, [dispatch]);

    const handleLoadMore = useCallback((): void => {
        setPage(page + 1);

        activeTab === TabsFollowers.FIND_FOLLOWINGS &&
            void dispatch(
                friendsActions.loadMoreNotFollowed({
                    page: String(page + 1),
                    limit: String(LIMIT),
                    ...(search ? { search } : {}),
                }),
            );

        activeTab === TabsFollowers.FOLLOWINGS &&
            void dispatch(
                friendsActions.loadMoreFollowings({
                    page: String(page + 1),
                    limit: String(LIMIT),
                }),
            );

        activeTab === TabsFollowers.FOLLOWERS &&
            void dispatch(
                friendsActions.loadMoreFollowers({
                    page: String(page + 1),
                    limit: String(LIMIT),
                }),
            );
    }, [setPage, page, dispatch, activeTab]);

    const handleSelectCard = useCallback(
        (user: FriendResponseDto | null): void => {
            setSelectedCard(user);
        },
        [setSelectedCard],
    );

    const handleTabClick = useCallback(
        (tab: string): void => {
            setPage(PAGE);
            setActiveTab(tab);
            setSelectedCard(null);
            setSearch('');
        },
        [setActiveTab, setSelectedCard, setPage],
    );

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            const value = event.target.value;
            setSearch(value);
            setPage(PAGE);

            if (debounceReference.current) {
                clearTimeout(debounceReference.current);
            }
            debounceReference.current = setTimeout(() => {
                void dispatch(
                    friendsActions.getNotFollowed({
                        page: String(PAGE),
                        limit: String(LIMIT),
                        ...(value.trim() ? { search: value.trim() } : {}),
                    }),
                );
            }, 300);
        },
        [dispatch],
    );

    const handleClearSearch = useCallback((): void => {
        setSearch('');
        setPage(PAGE);
        void dispatch(
            friendsActions.getNotFollowed({
                page: String(PAGE),
                limit: String(LIMIT),
            }),
        );
    }, [dispatch]);

    const handleAddFollowing = useCallback(
        (id: number): void => {
            void dispatch(
                friendsActions.addFollowing({
                    followingId: id,
                    offset: String(page * LIMIT),
                }),
            );
        },
        [dispatch, page],
    );

    const handleRemoveFollowing = useCallback(
        (id: number): void => {
            void dispatch(
                friendsActions.removeFollowing({
                    followingId: id,
                    offset: String(page * LIMIT),
                }),
            );
        },
        [dispatch, page],
    );

    const handleAddRemoverFollowing = useCallback(
        (id: number, idAdding: boolean | undefined): void => {
            if (idAdding) {
                void dispatch(
                    friendsActions.addFollowingFollower({
                        followingId: id,
                        offset: String(page * LIMIT),
                    }),
                );
            } else {
                void dispatch(
                    friendsActions.removeFollowingFollower({
                        followingId: id,
                        offset: String(page * LIMIT),
                    }),
                );
            }
        },
        [dispatch, page],
    );

    useEffect(() => {
        const loadUsers = async (): Promise<void> => {
            activeTab === TabsFollowers.FIND_FOLLOWINGS &&
                (await dispatch(
                    friendsActions.getNotFollowed({
                        page: PAGE.toString(),
                        limit: LIMIT.toString(),
                    }),
                ));
            activeTab === TabsFollowers.FOLLOWINGS &&
                (await dispatch(
                    friendsActions.getFollowings({
                        page: PAGE.toString(),
                        limit: LIMIT.toString(),
                    }),
                ));
            activeTab === TabsFollowers.FOLLOWERS &&
                (await dispatch(
                    friendsActions.getFollowers({
                        page: PAGE.toString(),
                        limit: LIMIT.toString(),
                    }),
                ));
        };
        void loadUsers();
    }, [dispatch, activeTab]);

    return (
        <section className="flex h-full w-full max-w-[1136px] flex-1 flex-col gap-8 2xl:basis-[1136px]">
            <Tabs
                tabs={tabs}
                handleTabClick={handleTabClick}
                activeTab={activeTab}
            />
            {activeTab === TabsFollowers.FIND_FOLLOWINGS && (
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search by name, username or email..."
                        className="bg-primary text-primary placeholder:text-lm-grey-200 focus:border-buttonPrimary w-full rounded-full border border-transparent px-5 py-2 pr-10 text-sm outline-none transition-colors"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="text-lm-grey-200 hover:text-buttonPrimary absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}
            {isLoading === DataStatus.PENDING ? (
                <Loader isOverflow />
            ) : (
                <div
                    className={getValidClassNames(
                        `${activeTab === TabsFollowers.FOLLOWERS && followers.length >= ROW_LENGTH ? classes.table : classes.row}`,
                        `${activeTab !== TabsFollowers.FOLLOWERS && users.length >= ROW_LENGTH ? classes.table : classes.row}`,
                    )}
                >
                    {activeTab === TabsFollowers.FIND_FOLLOWINGS && (
                        <TabContent
                            users={users}
                            isFollowed={false}
                            selectedCardId={selectedCard?.userId}
                            selectCard={handleSelectCard}
                            onToggleFollow={handleAddFollowing}
                            noUsersText={'No user found to follow.'}
                            totalCount={totalCount ?? 0}
                            loadMore={handleLoadMore}
                            isLoadingMore={isLoadingMore === DataStatus.PENDING}
                        />
                    )}

                    {activeTab === TabsFollowers.FOLLOWINGS && (
                        <TabContent
                            users={users}
                            isFollowed={true}
                            selectedCardId={selectedCard?.userId}
                            selectCard={handleSelectCard}
                            onToggleFollow={handleRemoveFollowing}
                            noUsersText={'You do not follow anyone yet.'}
                            totalCount={totalCount}
                            loadMore={handleLoadMore}
                            isLoadingMore={isLoadingMore === DataStatus.PENDING}
                        />
                    )}

                    {activeTab === TabsFollowers.FOLLOWERS && (
                        <TabContent
                            users={followers}
                            isFollowed={false}
                            selectedCardId={selectedCard?.userId}
                            selectCard={handleSelectCard}
                            onToggleFollow={handleAddRemoverFollowing}
                            noUsersText={'No one is following you yet..'}
                            totalCount={totalCount ?? 0}
                            loadMore={handleLoadMore}
                            isLoadingMore={isLoadingMore === DataStatus.PENDING}
                        />
                    )}
                </div>
            )}

            <aside
                className={getValidClassNames(
                    classes.detailsAside,
                    classes.animation,
                    !selectedCard && classes.hidden,
                )}
            >
                {selectedCard && (
                    <FriendDetails
                        id={selectedCard.userId}
                        isActive={true}
                        name={selectedCard.fullName ?? selectedCard.email}
                        avatarUrl={selectedCard.avatarUrl}
                        setSelectedCard={setSelectedCard}
                    />
                )}
            </aside>
        </section>
    );
};

export { Friends };
