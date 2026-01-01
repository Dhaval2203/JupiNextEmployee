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
    message,
} from 'antd';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import axios from 'axios';

import {
    primaryColor,
    secondaryColor,
    whiteColor,
    primaryBackgroundColor,
} from '@/Utils/Colors';

import { EMPLOYEE_DATA } from '@/Utils/Const';

/* ================= CONFIG ================= */

const API = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
    baseURL: API,
    headers: { 'Content-Type': 'application/json' },
});

/* ================= UTILS ================= */

const formatDuration = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
        2,
        '0'
    )}:${String(secs).padStart(2, '0')}`;
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

/* ================= COMPONENT ================= */

export default function TimeClockScreen() {
    const auth = useSelector((state) => state.auth);
    const user = auth?.user?.employee;

    const employee = useMemo(() => {
        if (!user?.employeeId) return null;
        return EMPLOYEE_DATA.find(
            (e) => e.employeeId === user.employeeId
        );
    }, [user]);

    const [timeClock, setTimeClock] = useState(null);
    const [activeBreakStart, setActiveBreakStart] = useState(null);
    const [now, setNow] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const isWorking = Boolean(
        timeClock?.startWorkTime && !timeClock?.endWorkTime
    );
    const isOnBreak = Boolean(activeBreakStart);

    /* ================= LIVE CLOCK ================= */

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    /* ================= LOAD TODAY ================= */

    useEffect(() => {
        let isMounted = true;

        const loadToday = async () => {
            if (!API || !user?.employeeId) return;

            try {
                const res = await api.get(
                    `/timeclock/today/${user.employeeId}`
                );
                if (isMounted) setTimeClock(res.data || null);
            } catch {
                if (isMounted) setTimeClock(null);
            }
        };

        loadToday();

        return () => {
            isMounted = false;
        };
    }, [user?.employeeId]);

    /* ================= ACTIONS ================= */

    const startShift = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await api.post('/timeclock/start', {
                employeeId: user.employeeId,
            });
            setTimeClock(res.data);
            message.success('Shift started');
        } catch {
            message.error('Failed to start shift');
        } finally {
            setLoading(false);
        }
    };

    const startBreak = () => {
        setActiveBreakStart(new Date());
        message.info('Break started');
    };

    const endBreak = async () => {
        if (!activeBreakStart || loading) return;
        setLoading(true);

        try {
            const breakSeconds = Math.floor(
                (Date.now() - activeBreakStart.getTime()) / 1000
            );

            await api.post('/timeclock/break', {
                employeeId: user.employeeId,
                breakSeconds,
            });

            setActiveBreakStart(null);

            const res = await api.get(
                `/timeclock/today/${user.employeeId}`
            );
            setTimeClock(res.data);

            message.success('Break ended');
        } catch {
            message.error('Failed to end break');
        } finally {
            setLoading(false);
        }
    };

    const endShift = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await api.post('/timeclock/end', {
                employeeId: user.employeeId,
            });
            setTimeClock(res.data);
            message.success('Shift ended');
        } catch {
            message.error('Failed to end shift');
        } finally {
            setLoading(false);
        }
    };

    /* ================= SAFE CALCULATIONS ================= */

    const totalSeconds = useMemo(() => {
        if (!timeClock?.startWorkTime) return 0;
        return Math.floor(
            (now.getTime() -
                new Date(timeClock.startWorkTime).getTime()) /
            1000
        );
    }, [now, timeClock]);

    const totalBreakSeconds = useMemo(() => {
        const base = timeClock?.totalBreakSeconds || 0;
        const active = isOnBreak
            ? Math.floor(
                (now.getTime() - activeBreakStart.getTime()) /
                1000
            )
            : 0;
        return base + active;
    }, [timeClock, isOnBreak, activeBreakStart, now]);

    const workingSeconds = Math.max(
        totalSeconds - totalBreakSeconds,
        0
    );

    const workPercent = totalSeconds
        ? Math.round((workingSeconds / totalSeconds) * 100)
        : 0;

    /* ================= CALENDAR (SAFE) ================= */

    const cellRender = useCallback((current, info) => {
        if (info.type !== 'date') return null;

        return (
            <div
                style={{
                    height: '100%',
                    padding: 6,
                    borderRadius: 8,
                    border: '1px solid #f0f0f0',
                    background: current.isSame(dayjs(), 'day')
                        ? `${primaryColor}10`
                        : whiteColor,
                }}
            >
                <div style={{ fontWeight: 600 }}>
                    {current.date()}
                </div>
            </div>
        );
    }, []);

    if (!user || !employee) {
        return <Tag color="red">User not logged in</Tag>;
    }

    /* ================= UI ================= */

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={10}>
                <Card
                    style={{
                        borderRadius: 20,
                        background: primaryBackgroundColor,
                    }}
                >
                    <Space>
                        <Avatar size={56} style={{ background: primaryColor }}>
                            {getInitials(employee.employeeName)}
                        </Avatar>
                        <div>
                            <div style={{ fontWeight: 600 }}>
                                {employee.employeeName}
                            </div>
                            <div style={{ color: secondaryColor }}>
                                {employee.designation}
                            </div>
                        </div>
                    </Space>

                    <Divider />

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: secondaryColor }}>
                            {formatDate(now)}
                        </div>
                        <div style={{ fontSize: 36, fontWeight: 700 }}>
                            {formatTime(now)}
                        </div>
                        <Tag color={isWorking ? 'green' : 'default'}>
                            {isWorking ? 'Working' : 'Not Working'}
                        </Tag>
                    </div>

                    <Divider />

                    <Row gutter={12}>
                        <Col span={8}>
                            <Card size="small">
                                <div>Total</div>
                                <strong>{formatDuration(totalSeconds)}</strong>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card size="small">
                                <div>Worked</div>
                                <strong>{formatDuration(workingSeconds)}</strong>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card size="small">
                                <div>Break</div>
                                <strong>{formatDuration(totalBreakSeconds)}</strong>
                            </Card>
                        </Col>
                    </Row>

                    <Divider />

                    <Progress
                        percent={workPercent}
                        strokeColor={primaryColor}
                        format={(p) => `${p}% productive`}
                    />

                    <Divider />

                    <Space direction="vertical" style={{ width: '100%' }}>
                        {!isWorking && (
                            <Button
                                type="primary"
                                size="large"
                                block
                                loading={loading}
                                onClick={startShift}
                            >
                                ▶ Start Shift
                            </Button>
                        )}

                        {isWorking && !isOnBreak && (
                            <Button
                                size="large"
                                block
                                loading={loading}
                                onClick={startBreak}
                            >
                                ☕ Start Break
                            </Button>
                        )}

                        {isOnBreak && (
                            <Button
                                danger
                                size="large"
                                block
                                loading={loading}
                                onClick={endBreak}
                            >
                                ⏹ End Break
                            </Button>
                        )}

                        {isWorking && (
                            <Button
                                danger
                                ghost
                                size="large"
                                block
                                loading={loading}
                                onClick={endShift}
                            >
                                ⏻ End Shift
                            </Button>
                        )}
                    </Space>
                </Card>
            </Col>

            <Col xs={24} md={14}>
                <Card title="📅 Attendance Overview" style={{ borderRadius: 20 }}>
                    <Calendar fullscreen={false} cellRender={cellRender} />
                </Card>
            </Col>
        </Row>
    );
}
