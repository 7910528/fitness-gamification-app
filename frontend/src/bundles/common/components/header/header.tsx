import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';

import { userApi } from '~/bundles/users/users.js';
import { type UserAuthResponseDto } from '~/bundles/users/users.js';

import { AppRoute } from '../../enums/enums.js';
import { useAppSelector, useEffect, useState } from '../../hooks/hooks.js';
import { Button, Layout, Link } from '../components.js';
import { Message, Navigation } from './components/components.js';
import styles from './styles.module.css';

type Properties = {
    toggleSidebar: () => void;
};

const Header: React.FC<Properties> = ({ toggleSidebar }): JSX.Element => {
    const user = useAppSelector(({ auth }) => auth.user as UserAuthResponseDto);
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
                        <span className="text-buttonPrimary font-heavybold text-[3.5rem] leading-[4rem]">
                            StayFit
                        </span>
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
