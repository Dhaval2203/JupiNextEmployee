'use client';

import { Row, Col, Tag } from 'antd';
import { useSelector } from 'react-redux';
import TimeClockPanel from './TimeClockPanel';
import TimeClockCalendar from './TimeClockCalendar';

export default function TimeClockScreen() {
    const user = useSelector((state) => state.auth?.user?.employee);

    if (!user) {
        return <Tag color="red">User not logged in</Tag>;
    }

    return (
        <Row gutter={16}>
            <Col xs={24} md={10}>
                <TimeClockPanel employee={user} />
            </Col>

            <Col xs={24} md={14}>
                <TimeClockCalendar monthData={{}} />
            </Col>
        </Row>
    );
}
