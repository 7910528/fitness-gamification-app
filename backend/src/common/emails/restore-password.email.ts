import { type Email } from '~/common/types/email.type.js';

const restorePasswordEmail = (link: string): Email => {
    return {
        subject: 'StayFit password recovery',
        html: `<div>
                <p>Hello!</p>
                <p>You recently requested to reset the password for your StayFit account. Use the link below to choose a new one:</p>
                <a href="${link}">Reset your password</a>
                <p>If you didn't request a password reset, you can safely ignore this email. The link is valid for 24 hours; please don't share it with anyone. If you need help, contact our support team at [Support Email]. Keep training — The StayFit Team.</p>
            </div>`,
    };
};

export { restorePasswordEmail };
