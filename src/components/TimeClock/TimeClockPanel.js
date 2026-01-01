'use client';

import {
    Avatar, Button, Card,
    Col, Divider, message,
    Progress, Row, Space,
    Tag,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { FiLogOut, FiPauseCircle, FiPlay } from 'react-icons/fi';
import { MdOutlineFreeBreakfast } from 'react-icons/md';

import {
    accentBackgroundColor, accentColor,
    primaryBackgroundColor, primaryColor,
    secondaryBackgroundColor, secondaryColor,
    whiteColor,
} from '@/Utils/Colors';

import {
    AddBreak, EndShift,
    FetchTodayTimeClock, StartShift,
} from './TimeClockApi';

/* ================= Utils ================= */

const FormatDuration = (sec = 0) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/* ================= Component ================= */

export default function TimeClockPanel({ employee }) {
    const [timeClock, setTimeClock] = useState(null);
    const [now, setNow] = useState(new Date());

    const [isWorking, setIsWorking] = useState(false);
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [activeBreakStart, setActiveBreakStart] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ================= Live Clock ================= */

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    /* ================= Load Today ================= */

    useEffect(() => {
        if (!employee?.employeeId) return;

        FetchTodayTimeClock(employee.employeeId)
            .then((res) => {
                setTimeClock(res.data || null);
                setIsWorking(
                    Boolean(res.data?.startWorkTime && !res.data?.endWorkTime)
                );
            })
            .catch(() => {
                setTimeClock(null);
                setIsWorking(false);
            });
    }, [employee?.employeeId]);

    /* ================= Calculations ================= */

    const totalSeconds = useMemo(() => {
        if (!timeClock?.startWorkTime) return 0;
        return Math.floor(
            (now - new Date(timeClock.startWorkTime)) / 1000
        );
    }, [now, timeClock]);

    const totalBreakSeconds = useMemo(() => {
        const base = timeClock?.totalBreakSeconds || 0;
        const active =
            isOnBreak && activeBreakStart
                ? Math.floor((now - activeBreakStart) / 1000)
                : 0;
        return base + active;
    }, [timeClock, isOnBreak, activeBreakStart, now]);

    const workingSeconds = Math.max(totalSeconds - totalBreakSeconds, 0);

    const percent = totalSeconds ? Math.round((workingSeconds / totalSeconds) * 100) : 0;

    /* ================= Actions ================= */

    const HandleStartShift = async () => {
        setLoading(true);
        try {
            const res = await StartShift(employee.employeeId);
            setTimeClock(res.data);
            setIsWorking(true);
            message.success('Shift started');
        } finally {
            setLoading(false);
        }
    };

    const HandleStartBreak = () => {
        setActiveBreakStart(new Date());
        setIsOnBreak(true);
        message.info('Break started');
    };

    const HandleEndBreak = async () => {
        setLoading(true);
        try {
            const breakSeconds = Math.floor(
                (now - activeBreakStart) / 1000
            );

            await AddBreak(employee.employeeId, breakSeconds);

            setIsOnBreak(false);
            setActiveBreakStart(null);

            const res = await FetchTodayTimeClock(employee.employeeId);
            setTimeClock(res.data);

            message.success('Break ended');
        } finally {
            setLoading(false);
        }
    };

    const HandleEndShift = async () => {
        setLoading(true);
        try {
            const res = await EndShift(employee.employeeId);
            setTimeClock(res.data);
            setIsWorking(false);
            setIsOnBreak(false);
            message.success('Shift ended');
        } finally {
            setLoading(false);
        }
    };

    const GetProductivityMeta = (percent = 0) => {
        if (percent < 40) {
            return {
                label: 'Low Productivity',
                color: secondaryColor
            };
        }

        if (percent < 75) {
            return {
                label: 'Medium Productivity',
                color: accentColor
            };
        }

        return {
            label: 'High Productivity',
            color: primaryColor
        };
    };

    const { label, color } = GetProductivityMeta(percent);

    /* ================= UI ================= */

    return (
        <Card style={{ borderRadius: 18, background: primaryBackgroundColor }}>
            <Space>
                <Avatar size={56} style={{ background: primaryColor }}>
                    {employee.employeeName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
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
                    {dayjs(now).format('dddd, DD MMM YYYY')}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>
                    {dayjs(now).format('hh:mm:ss A')}
                </div>
                <Tag color={isWorking ? 'green' : 'default'}>
                    {isWorking ? 'Working' : 'Not Working'}
                </Tag>
            </div>

            <Divider />

            <Row gutter={12}>
                <Col span={8}><Card size="small">Total<br /><b>{FormatDuration(totalSeconds)}</b></Card></Col>
                <Col span={8}><Card size="small">Worked<br /><b>{FormatDuration(workingSeconds)}</b></Card></Col>
                <Col span={8}><Card size="small">Break<br /><b>{FormatDuration(totalBreakSeconds)}</b></Card></Col>
            </Row>

            <Divider />

            <Progress
                percent={percent}
                strokeColor={primaryColor}
                format={(p) => (
                    <span style={{ color }}>
                        {p}% {label}
                    </span>
                )}
            />

            <Divider />

            <Space orientation="vertical" style={{ width: '100%' }}>
                {!isWorking && (
                    <Button
                        block
                        loading={loading}
                        icon={<FiPlay />}
                        style={{
                            background: primaryColor,
                            color: whiteColor,
                            border: `1px solid ${primaryColor}`,
                        }}
                        onClick={HandleStartShift}
                    >
                        Start Shift
                    </Button>
                )}

                {isWorking && !isOnBreak && (
                    <Button
                        block
                        icon={<MdOutlineFreeBreakfast />}
                        style={{
                            background: accentBackgroundColor,
                            color: accentColor,
                            border: `1px solid ${accentColor}`,
                        }}
                        onClick={HandleStartBreak}
                    >
                        Start Break
                    </Button>
                )}

                {isOnBreak && (
                    <Button
                        block
                        loading={loading}
                        icon={<FiPauseCircle />}
                        danger
                        style={{
                            background: secondaryBackgroundColor,
                            color: secondaryColor,
                            border: `1px solid ${secondaryColor}`,
                        }}
                        onClick={HandleEndBreak}
                    >
                        End Break
                    </Button>
                )}

                {isWorking && (
                    <Button
                        block
                        loading={loading}
                        icon={<FiLogOut />}
                        danger
                        ghost
                        style={{
                            background: secondaryBackgroundColor,
                            color: secondaryColor,
                            border: `1px solid ${secondaryColor}`,
                        }}
                        onClick={HandleEndShift}
                    >
                        End Shift
                    </Button>
                )}
            </Space>
        </Card>
    );
}
