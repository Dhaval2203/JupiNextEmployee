'use client';

import {
    Card,
    Button,
    Divider,
    Tag,
    Space,
    Progress,
    Avatar,
    Row,
    Col,
    Calendar,
    Tooltip,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import {
    primaryColor,
    secondaryColor,
    accentColor,
    whiteColor,
    primaryBackgroundColor,
} from '@/Utils/Colors';

import { EMPLOYEE_DATA } from '@/Utils/Const';

/* ================= Utils ================= */

const diffInSeconds = (start, end) =>
    dayjs(end).diff(dayjs(start), 'second');

const formatDuration = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
};

const formatDate = (date) =>
    dayjs(date).format('dddd, DD MMM YYYY');

const formatTime = (date) =>
    dayjs(date).format('hh:mm:ss A');

const getInitials = (name = '') =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

/* ================= Stable Month Data ================= */
/* Replace with API later */

const generateMonthData = () => {
    const data = {};
    const start = dayjs().startOf('month');
    const days = dayjs().daysInMonth();

    for (let i = 0; i < days; i += 1) {
        const date = start.add(i, 'day');

        // weekends off
        if (date.day() === 0 || date.day() === 6) continue;

        data[date.format('YYYY-MM-DD')] = {
            workSeconds: 8 * 3600,
            breakSeconds: 1 * 3600,
            sessions: 2,
        };
    }
    return data;
};

/* ================= Component ================= */

export default function TimeClockScreen() {
    const auth = useSelector((state) => state.auth);
    const user = auth?.user?.employee;
    const employee = useMemo(() => {
        if (!user?.employeeId) return null;
        return EMPLOYEE_DATA.find(
            (emp) => emp.employeeId === user.employeeId
        );
    }, [user]);

    const [sessions, setSessions] = useState([]);
    const [breaks, setBreaks] = useState([]);
    const [activeBreak, setActiveBreak] = useState(null);
    const [now, setNow] = useState(new Date());

    const monthData = useMemo(() => generateMonthData(), []);

    /* Live clock */
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const activeSession = useMemo(
        () => sessions.find((s) => !s.end),
        [sessions]
    );

    const isWorking = Boolean(activeSession);

    /* Calculations */
    const totalSessionSeconds = useMemo(() => {
        return sessions.reduce((acc, s) => {
            const end = s.end || now;
            return acc + diffInSeconds(s.start, end);
        }, 0);
    }, [sessions, now]);

    const totalBreakSeconds = useMemo(() => {
        const completed = breaks.reduce(
            (acc, b) => acc + diffInSeconds(b.start, b.end),
            0
        );
        const active = activeBreak
            ? diffInSeconds(activeBreak.start, now)
            : 0;
        return completed + active;
    }, [breaks, activeBreak, now]);

    const workingSeconds = Math.max(
        totalSessionSeconds - totalBreakSeconds,
        0
    );

    const workPercent = totalSessionSeconds
        ? Math.round((workingSeconds / totalSessionSeconds) * 100)
        : 0;

    /* ================= Calendar Cell ================= */
    const cellRender = (current, info) => {
        if (info.type !== 'date') return null;

        const key = current.format('YYYY-MM-DD');
        const dayData = monthData[key];
        const isToday = current.isSame(dayjs(), 'day');
        const isWeekend = current.day() === 0 || current.day() === 6;

        const dayLabel = current.date();

        const containerStyle = {
            background: dayData
                ? isToday
                    ? accentColor
                    : primaryColor
                : primaryBackgroundColor,
            color: dayData ? whiteColor : secondaryColor,
            borderRadius: 6,
            padding: 4,
            fontSize: 11,
            fontWeight: 600,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: !dayData && isWeekend ? 0.5 : 1,
            boxShadow: isToday ? `0 0 0 2px ${primaryColor}` : 'none',
        };

        return (
            <Tooltip
                title={
                    dayData ? (
                        <div>
                            <div><strong>Date:</strong> {current.format('DD MMM YYYY')}</div>
                            <div><strong>Working:</strong> {formatDuration(dayData.workSeconds)}</div>
                            <div><strong>Break:</strong> {formatDuration(dayData.breakSeconds)}</div>
                            <div><strong>Sessions:</strong> {dayData.sessions}</div>
                        </div>
                    ) : null
                }
            >
                <div style={containerStyle}>
                    <div>{String(dayLabel).padStart(2, '0')}</div>
                    {dayData && (
                        <div style={{ textAlign: 'right' }}>
                            {formatDuration(dayData.workSeconds)}
                        </div>
                    )}
                </div>
            </Tooltip>
        );
    };

    if (!user || !employee) {
        return <Tag color="red">User not logged in</Tag>;
    }

    /* ================= UI ================= */

    return (
        <Row gutter={[16, 16]}>
            {/* LEFT */}
            <Col xs={24} md={10}>
                <Card style={{ background: primaryBackgroundColor, borderRadius: 18 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Avatar size={48} style={{ background: primaryColor }}>
                            {getInitials(employee.employeeName)}
                        </Avatar>
                        <div>
                            <div style={{ fontWeight: 600, color: primaryColor }}>
                                {employee.employeeName}
                            </div>
                            <div style={{ color: secondaryColor }}>
                                {employee.designation}
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: secondaryColor }}>
                            {formatDate(now)}
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 600, color: accentColor }}>
                            {formatTime(now)}
                        </div>
                    </div>

                    <Divider />

                    <p><strong>Working:</strong> {formatDuration(workingSeconds)}</p>
                    <p><strong>Break:</strong> {formatDuration(totalBreakSeconds)}</p>

                    <Progress percent={workPercent} strokeColor={primaryColor} />

                    <Divider />

                    <Space orientation="vertical" style={{ width: '100%' }}>
                        {!isWorking && (
                            <Button type="primary" block onClick={() =>
                                setSessions((p) => [...p, { start: new Date(), end: null }])
                            }>
                                {sessions.length ? 'Resume Shift' : 'Start Shift'}
                            </Button>
                        )}

                        {isWorking && !activeBreak && (
                            <Button block onClick={() =>
                                setActiveBreak({ start: new Date(), end: null })
                            }>
                                Start Break
                            </Button>
                        )}

                        {activeBreak && (
                            <Button danger block onClick={() => {
                                setBreaks((p) => [...p, { ...activeBreak, end: new Date() }]);
                                setActiveBreak(null);
                            }}>
                                End Break
                            </Button>
                        )}

                        {isWorking && (
                            <Button danger block onClick={() =>
                                setSessions((p) =>
                                    p.map((s) =>
                                        s.end ? s : { ...s, end: new Date() }
                                    )
                                )
                            }>
                                Logout Shift
                            </Button>
                        )}
                    </Space>
                </Card>
            </Col>

            {/* RIGHT */}
            <Col xs={24} md={14}>
                <Card title="📅 Current Month Time Clock" style={{ borderRadius: 18 }}>
                    <Calendar fullscreen={false} cellRender={cellRender} />
                </Card>
            </Col>
        </Row>
    );
}
