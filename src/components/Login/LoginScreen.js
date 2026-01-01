'use client';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';

import {
    primaryColor,
    secondaryBackgroundColor,
    secondaryColor,
} from '../../Utils/Colors';

const { Title } = Typography;

export default function LoginScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [form] = Form.useForm();

    /* -------------------- Password Validation -------------------- */
    const passwordValid = {
        length: password.length >= 8,
        specialChar: /[!@#$%^&*]/.test(password),
        number: /\d/.test(password),
        uppercase: /[A-Z]/.test(password),
    };

    /* -------------------- Submit (Backend Login) -------------------- */
    const onFinish = async (values) => {
        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/employee/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // 🔐 Save to Redux (NO PASSWORD)
            dispatch(
                login({
                    employee: data.employee,
                    token: data.token,
                })
            );

            message.success('Login successful');
            router.push('/applyleave');
        } catch (error) {
            message.error(error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    /* -------------------- Password Policy UI -------------------- */
    const renderPasswordPolicy = () => {
        const rules = [
            { label: '8+ characters', key: 'length' },
            { label: '1 special char (!@#$%^&*)', key: 'specialChar' },
            { label: '1 number', key: 'number' },
            { label: '1 uppercase', key: 'uppercase' },
        ];

        return (
            <Space
                orientation="vertical"
                size={6}
                style={{ width: '100%', marginBottom: 16 }}
            >
                {rules.map((rule) => {
                    const valid = passwordValid[rule.key];
                    return (
                        <div
                            key={rule.key}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 12px',
                                borderRadius: 8,
                                backgroundColor: valid
                                    ? `${primaryColor}20`
                                    : '#f0f0f0',
                            }}
                        >
                            <span
                                style={{
                                    color: valid
                                        ? primaryColor
                                        : secondaryColor,
                                    fontWeight: 500,
                                }}
                            >
                                {rule.label}
                            </span>

                            {valid ? (
                                <CheckOutlined
                                    style={{ color: primaryColor }}
                                />
                            ) : (
                                <CloseOutlined
                                    style={{ color: secondaryColor }}
                                />
                            )}
                        </div>
                    );
                })}
            </Space>
        );
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: secondaryBackgroundColor,
                padding: 16,
            }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 12,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                }}
            >
                <Title
                    level={2}
                    style={{ textAlign: 'center', color: primaryColor }}
                >
                    Login
                </Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your email',
                            },
                            {
                                type: 'email',
                                message: 'Enter a valid email',
                            },
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password',
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter your password"
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </Form.Item>

                    {renderPasswordPolicy()}

                    <div style={{ textAlign: 'right', marginBottom: 12 }}>
                        <Button
                            type="link"
                            onClick={() => router.push('/forgotpassword')}
                            style={{ padding: 0 }}
                        >
                            Forgot password?
                        </Button>
                    </div>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                width: '100%',
                                backgroundColor: primaryColor,
                                borderColor: primaryColor,
                            }}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
