import { type LeaderboardItemDto, type UserAuthResponseDto } from 'shared';

import {
    Avatar,
    Button,
    Loader,
} from '~/bundles/common/components/components.js';
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
import { actions as leaderboardsActions } from '~/bundles/leaderboards/store/leaderboards.js';

const LIMIT = 20;
const SCROLL_THRESHOLD_PX = 200;

const medalClasses: Record<number, string> = {
    1: 'border-2 border-[#FFD700] shadow-[0_0_18px_-4px_rgba(255,215,0,0.6)] bg-gradient-to-r from-[#FFF4B8]/30 to-transparent',
    2: 'border-2 border-[#C0C0C0] shadow-[0_0_16px_-4px_rgba(192,192,192,0.6)] bg-gradient-to-r from-[#E8E8E8]/30 to-transparent',
    3: 'border-2 border-[#CD7F32] shadow-[0_0_16px_-4px_rgba(205,127,50,0.6)] bg-gradient-to-r from-[#E8C39E]/30 to-transparent',
};

const medalEmoji: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
};

type TabKey = 'all' | 'friends';

const Leaderboards: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(({ auth }) => auth) as {
        user: UserAuthResponseDto;
    };
    const {
        items,
        totalCount,
        currentUserRank,
        dataStatus,
        loadMoreDataStatus,
    } = useAppSelector(({ leaderboards }) => leaderboards);

    const [activeTab, setActiveTab] = useState<TabKey>('all');
    const [page, setPage] = useState<number>(1);

    const scrollContainerReference = useRef<HTMLDivElement>(null);
    const meRowReference = useRef<HTMLLIElement>(null);

    const loadPage = useCallback(
        (nextPage: number, tab: TabKey) => {
            void dispatch(
                leaderboardsActions.getLeaderboard({
                    page: nextPage,
                    limit: LIMIT,
                    friendsOnly: tab === 'friends',
                }),
            );
        },
        [dispatch],
    );

    useEffect(() => {
        dispatch(leaderboardsActions.resetLeaderboard());
        setPage(1);
        loadPage(1, activeTab);
    }, [dispatch, activeTab, loadPage]);

    const handleScroll = useCallback((): void => {
        const element = scrollContainerReference.current;
        if (!element) {
            return;
        }
        const { scrollTop, scrollHeight, clientHeight } = element;
        const isNearBottom =
            scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD_PX;
        const hasMore = items.length < totalCount;
        const isLoadingNow =
            dataStatus === DataStatus.PENDING ||
            loadMoreDataStatus === DataStatus.PENDING;

        if (isNearBottom && hasMore && !isLoadingNow) {
            const next = page + 1;
            setPage(next);
            loadPage(next, activeTab);
        }
    }, [
        items.length,
        totalCount,
        dataStatus,
        loadMoreDataStatus,
        page,
        loadPage,
        activeTab,
    ]);

    const handleSwitchTab = useCallback(
        (tab: TabKey) => () => setActiveTab(tab),
        [],
    );

    const handleScrollToMe = useCallback((): void => {
        if (meRowReference.current) {
            meRowReference.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            return;
        }

        // If current user isn't loaded yet, load enough pages
        if (currentUserRank) {
            const targetPage = Math.ceil(currentUserRank / LIMIT);
            const promises: Promise<unknown>[] = [];
            for (let p = page + 1; p <= targetPage; p++) {
                promises.push(
                    dispatch(
                        leaderboardsActions.getLeaderboard({
                            page: p,
                            limit: LIMIT,
                            friendsOnly: activeTab === 'friends',
                        }),
                    ),
                );
            }
            setPage(targetPage);
            void Promise.all(promises).then(() => {
                setTimeout(() => {
                    meRowReference.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }, 100);
            });
        }
    }, [currentUserRank, page, dispatch, activeTab]);

    const tabBase =
        'transition-bg rounded-34 flex w-[140px] cursor-pointer items-center justify-center self-stretch px-4 py-3 text-center text-sm md:text-base duration-300 sm:w-[160px] md:w-[180px]';
    const tabsWrapper =
        'text-secondary bg-primary rounded-34 flex max-w-max items-center justify-between font-semibold leading-4';

    return (
        <section className="flex h-full w-full max-w-[1136px] flex-1 flex-col gap-6 2xl:basis-[1136px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-primary text-2xl font-bold">
                    Leaderboards
                </h1>
                <div className="flex items-center gap-3">
                    {currentUserRank && (
                        <span className="text-secondary text-sm">
                            Your rank:{' '}
                            <span className="text-primary font-bold">
                                #{currentUserRank}
                            </span>
                        </span>
                    )}
                    <Button
                        label="Scroll to me"
                        variant="primary"
                        size="sm"
                        onClick={handleScrollToMe}
                    />
                </div>
            </div>

            <div className={tabsWrapper}>
                <div
                    onClick={handleSwitchTab('all')}
                    role="presentation"
                    className={getValidClassNames(
                        tabBase,
                        activeTab === 'all' ? 'bg-tertiary' : '',
                    )}
                >
                    All users
                </div>
                <div
                    onClick={handleSwitchTab('friends')}
                    role="presentation"
                    className={getValidClassNames(
                        tabBase,
                        activeTab === 'friends' ? 'bg-tertiary' : '',
                    )}
                >
                    My friends
                </div>
            </div>

            {dataStatus === DataStatus.PENDING && items.length === 0 ? (
                <Loader isOverflow />
            ) : (
                <div
                    ref={scrollContainerReference}
                    onScroll={handleScroll}
                    className="bg-secondary flex max-h-[calc(100vh-220px)] flex-col overflow-y-auto rounded-xl p-4"
                >
                    {items.length === 0 ? (
                        <p className="text-lm-grey-200 py-8 text-center">
                            No users found in the leaderboard.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {items.map((item) => {
                                const isMe = item.id === user.id;
                                const medal =
                                    medalClasses[item.rank] ?? 'border border-transparent';
                                const meHighlight = isMe
                                    ? 'ring-2 ring-buttonPrimary bg-buttonPrimary/10'
                                    : 'bg-primary';
                                return (
                                    <LeaderboardRow
                                        key={item.id}
                                        item={item}
                                        isMe={isMe}
                                        {...(isMe
                                            ? { meRowReference }
                                            : {})}
                                        className={getValidClassNames(
                                            medal,
                                            meHighlight,
                                        )}
                                    />
                                );
                            })}
                        </ul>
                    )}

                    {loadMoreDataStatus === DataStatus.PENDING && (
                        <div className="flex items-center justify-center py-3">
                            <Loader />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

type RowProperties = {
    item: LeaderboardItemDto;
    isMe: boolean;
    className?: string;
    meRowReference?: React.RefObject<HTMLLIElement> | undefined;
};

const LeaderboardRow = ({
    item,
    isMe,
    className,
    meRowReference,
}: RowProperties): JSX.Element => {
    const displayName =
        item.fullName ??
        (item.username ? `@${item.username}` : item.email);
    const medal = medalEmoji[item.rank] ?? '';

    return (
        <li
            ref={meRowReference}
            className={getValidClassNames(
                'flex items-center gap-4 rounded-lg px-4 py-3',
                className,
            )}
        >
            <div className="text-primary w-10 text-center text-lg font-bold">
                {medal || `#${item.rank}`}
            </div>
            <Avatar
                size="sm"
                email={item.email}
                avatarUrl={item.avatarUrl}
            />
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-primary truncate font-semibold">
                    {displayName}
                    {isMe && (
                        <span className="text-buttonPrimary ml-2 text-xs font-bold">
                            (you)
                        </span>
                    )}
                </span>
                <span className="text-lm-grey-200 text-xs">
                    {item.email}
                </span>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className="bg-buttonPrimary text-primary inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold">
                    LVL {item.level ?? 1}
                </span>
                <span className="text-lm-yellow-200 text-sm font-bold">
                    {item.bonusBalance.toLocaleString()} pts
                </span>
            </div>
        </li>
    );
};

export { Leaderboards };
