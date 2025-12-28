'use client';
import { Layout, Space, Typography } from 'antd';
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { accentColor, primaryColor, secondaryColor, secondaryTextColor } from '../Utils/Colors';
import { FaRegCopyright } from "react-icons/fa";
const { Footer } = Layout;
const { Text } = Typography;

export default function FooterComponent() {
    return (
        <Footer
            style={{
                textAlign: 'center',
                // ✅ Gradient matching Hero section blobs (light overlay)
                background: `linear-gradient(135deg, ${primaryColor}1A 0%, ${secondaryColor}1A 100%)`,
                color: secondaryTextColor,
                padding: '24px 16px', // ✅ compact vertical padding
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            }}
        >
            {/* Social Icons */}
            <Space size="middle" style={{ marginBottom: 8 }}>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                    <FaLinkedin size={20} color={primaryColor} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    <FaTwitter size={20} color={primaryColor} />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                    <FaGithub size={20} color={primaryColor} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <FaFacebook size={20} color={primaryColor} />
                </a>
            </Space>

            {/* Copyright */}
            <div
                style={{
                    marginBottom: 6,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                <Text
                    className="footer-copy"
                    style={{
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        textAlign: 'center',
                    }}
                >
                    <FaRegCopyright
                        style={{
                            fontSize: 14,
                            color: secondaryTextColor,
                        }}
                    />

                    <span style={{ color: secondaryTextColor }}>
                        {new Date().getFullYear()}
                    </span>

                    <span style={{ color: primaryColor }}>JupiNext</span>

                    <span className="desktop-only">-</span>

                    <span style={{ color: secondaryColor }}>
                        Where the Next Begins
                    </span>

                    <span className="desktop-only">·</span>

                    <span
                        style={{
                            color: accentColor,
                            fontWeight: 500,
                            fontSize: 13,
                            letterSpacing: '0.3px',
                        }}
                    >
                        All rights reserved
                    </span>
                </Text>
            </div>

            {/* Tagline */}
            <Text style={{ color: secondaryTextColor, fontWeight: 400, fontSize: 14 }}>
                Transforming ideas into smart, scalable, and impactful solutions
            </Text>
        </Footer>
    );
}
