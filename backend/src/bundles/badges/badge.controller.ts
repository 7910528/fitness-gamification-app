import { BadgesApiPath } from 'shared';

import {
    type ApiHandlerOptions,
    type ApiHandlerResponse,
    ApiHandlerResponseType,
    BaseController,
} from '~/common/controller/controller.js';
import { ApiPath } from '~/common/enums/enums.js';
import { HttpCode } from '~/common/http/http.js';
import { type Logger } from '~/common/logger/logger.js';

import { type BadgeService } from './badge.service.js';

class BadgeController extends BaseController {
    private badgeService: BadgeService;

    public constructor(logger: Logger, badgeService: BadgeService) {
        super(logger, ApiPath.BADGES);

        this.badgeService = badgeService;

        this.addRoute({
            path: BadgesApiPath.ROOT,
            method: 'GET',
            isProtected: true,
            handler: () => this.findAll(),
        });

        this.addRoute({
            path: BadgesApiPath.USER_ID,
            method: 'GET',
            isProtected: true,
            handler: (options) =>
                this.findByUserId(
                    options as ApiHandlerOptions<{
                        params: { id: string };
                    }>,
                ),
        });
    }

    private async findAll(): Promise<ApiHandlerResponse> {
        return {
            type: ApiHandlerResponseType.DATA,
            status: HttpCode.OK,
            payload: await this.badgeService.findAll(),
        };
    }

    private async findByUserId(
        options: ApiHandlerOptions<{ params: { id: string } }>,
    ): Promise<ApiHandlerResponse> {
        const { params } = options;
        const badges = await this.badgeService.findByUserId(Number(params.id));

        return {
            type: ApiHandlerResponseType.DATA,
            status: HttpCode.OK,
            payload: badges,
        };
    }
}

export { BadgeController };
