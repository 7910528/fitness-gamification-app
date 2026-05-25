import { LockClosedIcon } from '@heroicons/react/24/solid';

import { formatChatDate } from '~/bundles/chats/helpers/helpers.js';
import { type ChatPreviewResponseDto } from '~/bundles/chats/types/types.js';
import { Icon, Link } from '~/bundles/common/components/components.js';
import { AppRoute } from '~/bundles/common/enums/enums.js';
import {
    configureString,
    getValidClassNames,
} from '~/bundles/common/helpers/helpers.js';

type Properties = {
    aiAssistantChat: ChatPreviewResponseDto | null;
    isActive: boolean;
    isLocked?: boolean;
    onLoadCurrentChat: () => void;
};

const AiChatLink = ({
    aiAssistantChat,
    isActive,
    isLocked = false,
    onLoadCurrentChat,
}: Properties): JSX.Element => {
    const chatRouteById = configureString(AppRoute.CHATS_AI_ASSISTANT_$ID, {
        id: String(aiAssistantChat?.id),
    }) as typeof AppRoute.CHATS_AI_ASSISTANT_$ID;

    const inner = (
        <div
            className={getValidClassNames(
                isActive &&
                    'bg-primary border-l-lm-yellow-100 rounded-br-xl rounded-tr-xl border-l-4 p-2',
                'flex items-center gap-5',
                isLocked && 'opacity-60',
            )}
        >
            <div className="relative">
                <Icon name="aiAssistantIcon" className="h-12 w-12" />
                {isLocked && (
                    <span
                        className="bg-buttonTertiary text-primary absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full"
                        title="Premium only"
                    >
                        <LockClosedIcon className="h-3 w-3" />
                    </span>
                )}
            </div>
            <div className="flex w-full flex-col items-start gap-1 overflow-hidden py-2 lg:max-w-[9rem]">
                <p
                    className={getValidClassNames(
                        isActive ? 'text-action' : 'text-primary',
                        'text-sm font-semibold',
                    )}
                >
                    Personal Assistant
                </p>
                <p className="text-secondary truncate text-xs">
                    {isLocked
                        ? 'Premium subscribers only'
                        : aiAssistantChat?.lastMessage?.text}
                </p>
            </div>
            <p className="text-secondary text-xs">
                {!isLocked &&
                    formatChatDate(
                        aiAssistantChat?.lastMessage?.createdAt ?? null,
                        false,
                    )}
            </p>
        </div>
    );

    if (isLocked) {
        return (
            <Link to={AppRoute.PROFILE_SUBSCRIPTION}>
                <button
                    className="w-full"
                    title="Subscribe to Premium to chat with AI Assistant"
                >
                    {inner}
                </button>
            </Link>
        );
    }

    return (
        <Link to={chatRouteById}>
            <button onClick={onLoadCurrentChat} className="w-full">
                {inner}
            </button>
        </Link>
    );
};

export { AiChatLink };
