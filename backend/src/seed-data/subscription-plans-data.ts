import { stripeService } from '~/common/services/services.js';

const subscriptionPremium = {
    name: 'Premium',
    price: 20,
    description:
        'Unlock the full StayFit experience. With Premium you get exclusive access to our AI Personal Assistant — chat with it any time for personalized workout advice, adaptive training tips and goal-driven recommendations. Premium also removes all ads across the app and grants priority support. The AI chat is available only with an active Premium subscription.',
};

const { stripeProductId: premiumProductId, stripePriceId: premiumPriceId } =
    await stripeService.createSubscriptionPlan({ ...subscriptionPremium });

const subscriptionPlans = [
    {
        ...subscriptionPremium,
        stripeProductId: premiumProductId,
        stripePriceId: premiumPriceId,
    },
];

export { subscriptionPlans };
