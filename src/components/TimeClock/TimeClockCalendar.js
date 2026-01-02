'use client';

import { Divider, Tooltip } from 'antd';
import dayjs from 'dayjs';

import {
    primaryColor,
    whiteColor,
    secondaryColor,
    accentColor,
    secondaryBackgroundColor,
} from '@/Utils/Colors';

/* ================= Utils ================= */

const FormatDuration = (sec = 0) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
};

const FormatTime = (date) =>
    date ? dayjs(date).format('hh:mm A') : '--';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ================= Tooltip UI ================= */

const RowItem = ({ label, value, highlight }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
            fontWeight: highlight ? 600 : 400,
            color: highlight ? primaryColor : secondaryColor,
            fontSize: 12,
        }}
    >
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

const TooltipContent = ({ date, day }) => {
    if (!day) return null;

    const isFullDay = day.totalWorkSeconds >= 8 * 3600;

    return (
        <div
            style={{
                minWidth: 240,
                background: whiteColor,
                borderRadius: 14,
                padding: 14,
                boxShadow: '0 10px 28px rgba(0,0,0,0.15)',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ fontWeight: 600 }}>
                    {date.format('DD MMM YYYY')}
                </div>

                <div
                    style={{
                        fontSize: 11,
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: isFullDay
                            ? `${primaryColor}15`
                            : `${secondaryColor}15`,
                        color: isFullDay
                            ? primaryColor
                            : secondaryColor,
                        fontWeight: 600,
                    }}
                >
                    {isFullDay ? 'Full Day' : 'Short Hours'}
                </div>
            </div>

            <Divider style={{ margin: '10px 0' }} />

            {/* Details */}
            <RowItem label="Start" value={FormatTime(day.startWorkTime)} />
            <RowItem label="End" value={FormatTime(day.endWorkTime)} />
            <RowItem
                label="Break"
                value={FormatDuration(day.totalBreakSeconds)}
            />
            <RowItem
                label="Worked"
                value={FormatDuration(day.totalWorkSeconds)}
                highlight
            />
        </div>
    );
};

/* ================= Component ================= */

export default function TimeClockCalendar({
    monthData = {},
    year,
    month, // 1–12
}) {
    const today = dayjs();

    const startOfMonth = dayjs(
        `${year}-${String(month).padStart(2, '0')}-01`
    );
    const endOfMonth = startOfMonth.endOf('month');

    const startDay = startOfMonth.day(); // 0–6
    const totalDays = endOfMonth.date();

    /* ================= Build calendar cells ================= */

    const cells = [];

    // Empty cells before month start
    for (let i = 0; i < startDay; i++) {
        cells.push(null);
    }

    // Actual dates
    for (let d = 1; d <= totalDays; d++) {
        cells.push(startOfMonth.date(d));
    }

    return (
        <div>
            {/* ===== Week Header ===== */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    marginBottom: 10,
                }}
            >
                {WEEK_DAYS.map((day) => (
                    <div
                        key={day}
                        style={{
                            textAlign: 'center',
                            fontWeight: 600,
                            color: secondaryColor,
                        }}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* ===== Calendar Grid ===== */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 10,
                }}
            >
                {cells.map((date, index) => {
                    if (!date) return <div key={index} />;

                    const key = date.format('YYYY-MM-DD');
                    const day = monthData[key];

                    const isToday = date.isSame(today, 'day');
                    const isPastDay = date.isBefore(today, 'day');
                    const isWeekend =
                        date.day() === 0 || date.day() === 6;

                    let barColor = '#e5e7eb';
                    if (day) {
                        barColor =
                            day.totalWorkSeconds >= 8 * 3600
                                ? primaryColor
                                : secondaryColor;
                    }

                    return (
                        <Tooltip
                            key={key}
                            placement="top"
                            overlayInnerStyle={{
                                background: 'transparent',
                                padding: 0,
                            }}
                            title={
                                day ? (
                                    <TooltipContent
                                        date={date}
                                        day={day}
                                    />
                                ) : null
                            }
                        >
                            <div
                                style={{
                                    minHeight: 86,
                                    padding: 10,
                                    borderRadius: 14,
                                    background: isToday
                                        ? `${primaryColor}12`
                                        : whiteColor,
                                    border: `1px solid ${isToday
                                            ? primaryColor
                                            : secondaryBackgroundColor
                                        }`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    opacity: isWeekend ? 0.5 : 1,
                                    cursor: day ? 'pointer' : 'default',
                                }}
                            >
                                {/* Date number */}
                                <div
                                    style={{
                                        fontWeight: 600,
                                        color: accentColor,
                                    }}
                                >
                                    {date.date()}
                                </div>

                                {/* Past day working hours */}
                                {day && isPastDay && (
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: secondaryColor,
                                        }}
                                    >
                                        {FormatDuration(
                                            day.totalWorkSeconds
                                        )}
                                    </div>
                                )}

                                {/* Status bar */}
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
                })}
            </div>
        </div>
    );
}
