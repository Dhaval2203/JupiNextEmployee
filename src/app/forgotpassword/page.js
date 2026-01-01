'use client';

import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function ForgotPassword() {
    const router = useRouter();

    const onFinish = async ({ email }) => {
        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/employee/forgot-password`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            }
        );

        message.success('OTP sent to your email');
        router.push(`/reset-password?email=${email}`);
    };

    return (
        <Card style={{ width: 380, margin: 'auto', marginTop: 100 }}>
            <Title level={3}>Forgot Password</Title>

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email' }]}
                >
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Send OTP
                </Button>
            </Form>
        </Card>
    );
}
