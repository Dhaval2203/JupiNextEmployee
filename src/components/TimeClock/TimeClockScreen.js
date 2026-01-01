'use client';

import { Row, Col, Tag, Select, Space, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

import TimeClockPanel from './TimeClockPanel';
import TimeClockCalendar from './TimeClockCalendar';
import { FetchMonthTimeClock } from './TimeClockApi';

/* ================= Day.js Setup ================= */

dayjs.extend(localeData);

/* ================= Helpers ================= */

const YEARS = Array.from({ length: 5 }, (_, i) => dayjs().year() - i);
const MONTHS = dayjs.months(); // ✅ now works correctly

/* ================= Component ================= */

export default function TimeClockScreen() {
    const user = useSelector((state) => state.auth?.user?.employee);

    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [selectedMonth, setSelectedMonth] = useState(
        dayjs().month() + 1 // 1–12
    );

    const [monthData, setMonthData] = useState({});
    const [loadingMonth, setLoadingMonth] = useState(false);

    /* ================= Fetch Monthly Data ================= */
    /* React 18 + StrictMode safe */

    useEffect(() => {
        if (!user?.employeeId) return;

        let cancelled = false;

        const LoadMonthData = async () => {
            try {
                setLoadingMonth(true);

                const res = await FetchMonthTimeClock(
                    user.employeeId,
                    selectedYear,
                    String(selectedMonth).padStart(2, '0')
                );

                if (cancelled) return;

                const map = {};
                res.data.forEach((d) => {
                    map[dayjs(d.workDate).format('YYYY-MM-DD')] = d;
                });

                setMonthData(map);
            } catch {
                if (!cancelled) setMonthData({});
            } finally {
                if (!cancelled) setLoadingMonth(false);
            }
        };

        LoadMonthData();

        return () => {
            cancelled = true;
        };
    }, [user?.employeeId, selectedYear, selectedMonth]);

    /* ================= Guard ================= */

    if (!user) {
        return <Tag color="red">User not logged in</Tag>;
    }

    /* ================= UI ================= */

    return (
        <Row gutter={16} className='mt-3 mb-3'>
            {/* LEFT: Time Clock Panel */}
            <Col xs={24} md={10}>
                <TimeClockPanel employee={user} />
            </Col>

            {/* RIGHT: Calendar */}
            <Col xs={24} md={14}>
                <Card
                    title="Attendance Overview"
                    loading={loadingMonth}
                >
                    {/* Year / Month Selector */}
                    <Space style={{ marginBottom: 16 }}>
                        <Select
                            value={selectedYear}
                            onChange={setSelectedYear}
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
                                <Select.Option
                                    key={i + 1}
                                    value={i + 1}
                                >
                                    {m}
                                </Select.Option>
                            ))}
                        </Select>
                    </Space>

                    {/* Calendar */}
                    <TimeClockCalendar
                        year={selectedYear}
                        month={selectedMonth}
                        monthData={monthData}
                    />
                </Card>
            </Col>
        </Row>
    );
}
