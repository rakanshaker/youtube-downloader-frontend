export const formattedNum = (num) => {
    return Math.abs(num) > 999999
        ? Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + 'm'
        : Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
        : Math.sign(num) * Math.abs(num);
};
