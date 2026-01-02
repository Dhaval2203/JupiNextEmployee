'use client';

import {
    Modal,
    Form,
    TimePicker,
    Input,
    Divider,
    message,
} from 'antd';
import dayjs from 'dayjs';

import { RequestAttendanceAdjustment } from './TimeClockApi';

export default function AttendanceAdjustmentModal({
    open,
    onClose,
    day,
    employee,
    onSuccess,
}) {
    const [form] = Form.useForm();

    if (!day) return null;

    const submit = async (values) => {
        const start = dayjs(values.startTime);
        const end = dayjs(values.endTime);

        if (!end.isAfter(start)) {
            return message.error('End time must be after start time');
        }

        const requestedSeconds = end.diff(start, 'second');

        try {
            await RequestAttendanceAdjustment({
                timeClockId: day.id,
                employeeId: employee.employeeId, // ✅ ID ONLY
                requestedSeconds,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                reason: values.reason,
                comment: values.comment,
            });

            message.success('Adjustment request submitted');
            form.resetFields();
            onClose();
            onSuccess?.();
        } catch {
            message.error('Failed to submit request');
        }
    };

    return (
        <Modal
            open={open}
            title="Request Attendance Adjustment"
            okText="Submit Request"
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            onOk={() => form.submit()}
        >
            {/* ===== Metadata ===== */}
            <div style={{ fontSize: 13 }}>
                <p>
                    <b>Date:</b>{' '}
                    {dayjs(day.workDate).format('DD MMM YYYY')}
                </p>
                <p>
                    <b>Requested By (ID):</b>{' '}
                    {employee.employeeId}
                </p>

                {day.adjustment?.reviewedById && (
                    <p>
                        <b>Reviewed By (ID):</b>{' '}
                        {day.adjustment.reviewedById}
                    </p>
                )}

                {day.adjustment?.status && (
                    <p>
                        <b>Status:</b> {day.adjustment.status}
                    </p>
                )}
            </div>

            <Divider />

            {/* ===== Form ===== */}
            <Form
                form={form}
                layout="vertical"
                onFinish={submit}
            >
                <Form.Item
                    label="Start Time"
                    name="startTime"
                    rules={[{ required: true }]}
                >
                    <TimePicker
                        use12Hours
                        format="hh:mm A"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="End Time"
                    name="endTime"
                    rules={[{ required: true }]}
                >
                    <TimePicker
                        use12Hours
                        format="hh:mm A"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="Reason"
                    name="reason"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Late login, meeting, etc." />
                </Form.Item>

                <Form.Item label="Comment" name="comment">
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
