import svgCaptcha from 'svg-captcha';

export const generateCaptcha = () => {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 2,
        color: true,
        background: '#cc9966'
    });
    return captcha;
};