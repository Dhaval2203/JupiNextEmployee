'use client';

import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';

const { Title } = Typography;

export default function ResetPassword() {
    const params = useSearchParams();
    const email = params.get('email');
    const router = useRouter();

    const onFinish = async (values) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/employee/reset-password`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp: values.otp,
                    newPassword: values.password,
                }),
            }
        );

        const data = await res.json();
        if (!res.ok) {
            return message.error(data.message);
        }

        message.success('Password reset successful');
        router.push('/login');
    };

    return (
        <Card style={{ width: 380, margin: 'auto', marginTop: 100 }}>
            <Title level={3}>Reset Password</Title>

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="OTP"
                    name="otp"
                    rules={[{ required: true, len: 6 }]}
                >
                    <Input placeholder="Enter 6-digit OTP" />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="password"
                    rules={[{ required: true, min: 8 }]}
                >
                    <Input.Password />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Reset Password
                </Button>
            </Form>
        </Card>
    );
}
