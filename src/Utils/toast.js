import { notification } from 'antd';

// Global config (optional)
notification.config({
    placement: 'topRight',
    duration: 3,
    maxCount: 3,
});

export const showToast = (
    type = 'info',
    message,
    description,
    duration = 3
) => {
    notification[type]({
        message,
        description,
        duration,
    });
};
