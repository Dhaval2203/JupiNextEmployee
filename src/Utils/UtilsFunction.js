
import dayjs from "dayjs";

export default function numberToWords(amount) {
    if (amount === 0) return 'Zero only';
    if (amount == null || isNaN(amount)) return 'Zero only';

    const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWords = (n) => {
        n = Math.floor(n);
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
        if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
        if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
        return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };

    return (amount < 0 ? 'Minus ' : '') + numToWords(Math.abs(amount)) + ' only';
};

export const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
};

export const calculateLeaveDays = (start, end, startType, endType) => {
    let days = 0;
    let current = dayjs(start);

    while (current.diff(end, "day") <= 0) {
        if (!isWeekend(current)) days += 1;
        current = current.add(1, "day");
    }

    if (start.isSame(end, "day")) {
        if (isWeekend(start)) return 0;
        return startType === "half" ? 0.5 : 1;
    }

    if (startType === "half") days -= 0.5;
    if (endType === "half") days -= 0.5;

    return days > 0 ? days : 0;
};