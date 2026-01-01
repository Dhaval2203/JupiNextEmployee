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

/* ================= Component ================= */

export default function TimeClockCalendar({
    monthData = {},
    year,
    month, // 1–12
}) {
    const today = dayjs();

    // 🔑 Build selected month correctly
    const selectedMonth = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
    const startOfMonth = dayjs(`${year}-${month}-01`);
    const endOfMonth = selectedMonth.endOf('month');

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
                                ? '#22c55e' // green
                                : '#f59e0b'; // amber
                    }

                    return (
                        <Tooltip
                            key={key}
                            placement="top"
                            title={
                                day && (
                                    <div style={{ minWidth: 200 }}>
                                        <div>
                                            <b>Date:</b>{' '}
                                            {date.format('DD MMM YYYY')}
                                        </div>

                                        <Divider style={{ margin: '6px 0' }} />

                                        <div>
                                            <b>Start:</b>{' '}
                                            {FormatTime(day.startWorkTime)}
                                        </div>
                                        <div>
                                            <b>End:</b>{' '}
                                            {FormatTime(day.endWorkTime)}
                                        </div>
                                        <div>
                                            <b>Break:</b>{' '}
                                            {FormatDuration(
                                                day.totalBreakSeconds
                                            )}
                                        </div>
                                        <div>
                                            <b>Worked:</b>{' '}
                                            {FormatDuration(
                                                day.totalWorkSeconds
                                            )}
                                        </div>
                                    </div>
                                )
                            }
                        >
                            <div
                                style={{
                                    minHeight: 82,
                                    padding: 8,
                                    borderRadius: 12,
                                    background: isToday
                                        ? `${primaryColor}15`
                                        : whiteColor,
                                    border: `1px solid ${isToday
                                        ? primaryColor
                                        : secondaryBackgroundColor
                                        }`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    opacity: isWeekend ? 0.5 : 1,
                                    cursor: 'pointer',
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

                                {/* Previous day working hours */}
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
