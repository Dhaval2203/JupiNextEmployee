'use client';

import {
    Row,
    Col,
    Tag,
    Select,
    Space,
    Card,
} from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import TimeClockPanel from './TimeClockPanel';
import TimeClockCalendar from './TimeClockCalendar';
import AttendanceAdjustmentModal from './AttendanceAdjustmentModal';
import { FetchMonthTimeClock } from './TimeClockApi';

const YEARS = Array.from({ length: 5 }, (_, i) => dayjs().year() - i);
const MONTHS = dayjs.months();

export default function TimeClockScreen() {
    const user = useSelector((state) => state.auth?.user?.employee);

    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
    const [monthData, setMonthData] = useState({});
    const [loadingMonth, setLoadingMonth] = useState(false);

    const [selectedDay, setSelectedDay] = useState(null);
    const [adjustmentOpen, setAdjustmentOpen] = useState(false);

    const loadMonthData = async () => {
        setLoadingMonth(true);
        try {
            const res = await FetchMonthTimeClock(
                user.employeeId,
                selectedYear,
                String(selectedMonth).padStart(2, '0')
            );

            const map = {};
            res.data?.forEach((d) => {
                map[dayjs(d.workDate).format('YYYY-MM-DD')] = d;
            });

            setMonthData(map);
        } finally {
            setLoadingMonth(false);
        }
    };

    useEffect(() => {
        if (user?.employeeId) loadMonthData();
    }, [user?.employeeId, selectedYear, selectedMonth]);

    if (!user) return <Tag color="red">User not logged in</Tag>;

    return (
        <>
            <Row gutter={16} className="mt-3 mb-3">
                <Col xs={24} md={10}>
                    <TimeClockPanel employee={user} />
                </Col>

                <Col xs={24} md={14}>
                    <Card title="Attendance Overview" loading={loadingMonth}>
                        <Space style={{ marginBottom: 16 }}>
                            <Select
                                value={selectedYear}
                                onChange={(y) => {
                                    setSelectedYear(y);
                                    setSelectedMonth(1);
                                }}
                                style={{ width: 120 }}
                            >
                                {YEARS.map((y) => (
                                    <Select.Option key={y} value={y}>
                                        {y}
                                    </Select.Option>
                                ))}
                            </Select>

                            <Select
                                value={selectedMonth}
                                onChange={setSelectedMonth}
                                style={{ width: 160 }}
                            >
                                {MONTHS.map((m, i) => (
                                    <Select.Option key={i + 1} value={i + 1}>
                                        {m}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Space>

                        <TimeClockCalendar
                            year={selectedYear}
                            month={selectedMonth}
                            monthData={monthData}
                            onRequestAdjustment={(day) => {
                                setSelectedDay(day);
                                setAdjustmentOpen(true);
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            <AttendanceAdjustmentModal
                open={adjustmentOpen}
                onClose={() => {
                    setAdjustmentOpen(false);
                    setSelectedDay(null);
                }}
                day={selectedDay}
                employee={user}
                onSuccess={loadMonthData}
            />
        </>
    );
}
