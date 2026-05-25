import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';

import { userApi } from '~/bundles/users/users.js';
import { type UserAuthResponseDto } from '~/bundles/users/users.js';

import { AppRoute, ComponentSize } from '../../enums/enums.js';
import { Theme } from '../../enums/theme.js';
import { useAppSelector, useEffect, useState } from '../../hooks/hooks.js';
import { Button, Icon, Layout, Link } from '../components.js';
import { IconColor } from '../icon/enums/enums.js';
import { Message, Navigation } from './components/components.js';
import styles from './styles.module.css';

type Properties = {
    toggleSidebar: () => void;
};

const Header: React.FC<Properties> = ({ toggleSidebar }): JSX.Element => {
    const { theme } = useAppSelector(({ theme }) => theme);
    const user = useAppSelector(
        ({ auth }) => auth.user as UserAuthResponseDto,
    );
    const { email, avatarUrl, level, id, bonusBalance } = user;

    const [streak, setStreak] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (!id) {
            return;
        }
        userApi
            .getStreak()
            .then((result) => {
                if (!cancelled) {
                    setStreak(result.streak);
                }
            })
            .catch(() => {
                // ignore — streak is non-critical
            });
        return () => {
            cancelled = true;
        };
        // Refetch when balance changes (signals a workout was just logged).
    }, [id, bonusBalance]);

    return (
        <header className={styles['header']}>
            <Layout className={`${styles['header-container']}`}>
                <div className="mr-5 lg:hidden">
                    <Button
                        label=""
                        variant="secondary"
                        onClick={toggleSidebar}
                        leftIcon={<Bars3BottomLeftIcon className="h-4 w-4" />}
                        size="sm"
                        className="p-2"
                    />
                </div>
                <div className="hidden w-full max-w-[16rem] md:flex">
                    <Link to={AppRoute.OVERVIEW}>
                        {theme === Theme.DARK ? (
                            <Icon
                                name={'logoHeader'}
                                color={IconColor.PRIMARY}
                                size={ComponentSize.EXTRA_LARGE}
                                className="aspect-video max-h-12"
                            />
                        ) : (
                            <Icon
                                name={'logoHeaderLight'}
                                color={IconColor.PRIMARY}
                                size={ComponentSize.EXTRA_LARGE}
                                className="aspect-video max-h-12"
                            />
                        )}
                    </Link>
                </div>

                <div className="mr-5 md:hidden">
                    <Link to={AppRoute.OVERVIEW}>
                        <Icon
                            name={'logoIcon'}
                            color={IconColor.PRIMARY}
                            size={ComponentSize.LARGE}
                        />
                    </Link>
                </div>
                <div className="flex w-full justify-between">
                    <Message />
                    <Navigation
                        email={email}
                        avatarUrl={avatarUrl}
                        level={level}
                        streak={streak}
                    />
                </div>
            </Layout>
        </header>
    );
};

export { Header };
