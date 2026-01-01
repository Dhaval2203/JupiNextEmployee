'use client';

import { Calendar, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { primaryColor, whiteColor } from '@/Utils/Colors';

const FormatDuration = (sec = 0) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
};

export default function TimeClockCalendar({ monthData }) {
    const DateCellRender = (value) => {
        const key = value.format('YYYY-MM-DD');
        const day = monthData[key];
        const isToday = value.isSame(dayjs(), 'day');

        let barColor = '#e5e7eb';
        if (day) {
            barColor =
                day.totalWorkSeconds >= 8 * 3600
                    ? '#22c55e'
                    : '#f59e0b';
        }

        return (
            <Tooltip
                title={
                    day && (
                        <>
                            <div><b>Date:</b> {value.format('DD MMM YYYY')}</div>
                            <div><b>Worked:</b> {FormatDuration(day.totalWorkSeconds)}</div>
                            <div><b>Break:</b> {FormatDuration(day.totalBreakSeconds)}</div>
                        </>
                    )
                }
            >
                <div
                    style={{
                        height: 64,
                        padding: 6,
                        borderRadius: 10,
                        background: isToday
                            ? `${primaryColor}15`
                            : whiteColor,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ fontWeight: 600 }}>{value.date()}</div>

                    {day && (
                        <div
                            style={{
                                height: 6,
                                borderRadius: 4,
                                background: barColor,
                            }}
                        />
                    )}
                </div>
            </Tooltip>
        );
    };

    return (
        <Calendar
            fullscreen={false}
            dateCellRender={DateCellRender}
        />
    );
}
