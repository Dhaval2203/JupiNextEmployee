'use client';

import dynamic from 'next/dynamic';
import { Button, Layout } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TiThMenuOutline } from 'react-icons/ti';
import { CiSquareCheck } from 'react-icons/ci';
import {
    accentColor,
    primaryColor,
    secondaryColor,
    whiteColor,
} from '../Utils/Colors';
import { menuItems } from '../Utils/Const';
import { useRouter, usePathname } from 'next/navigation';
const { Header } = Layout;

const ClientMenu = dynamic(
    () => import('antd').then((m) => m.Menu),
    { ssr: false }
);

const ClientDrawer = dynamic(
    () => import('antd').then((m) => m.Drawer),
    { ssr: false }
);

// Utility: hex → rgba
const hexToRgba = (hex, opacity = 0.2) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function Headers() {
    const router = useRouter();
    const pathname = usePathname();

    const [selectedKey, setSelectedKey] = useState('salarysleep');
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Update selectedKey based on current route
    useEffect(() => {
        const activeItem = menuItems.find((item) =>
            pathname === '/' ? item.key === 'salarysleep' : pathname.startsWith(item.key)
        );

        if (activeItem) {
            window.requestAnimationFrame(() => {
                setSelectedKey(activeItem.key);
            });
        }
    }, [pathname]);

    const handleMenuClick = ({ key }) => {
        setSelectedKey(key);
        setDrawerOpen(false);
        router.push(key);
    };

    // Prepare desktop menu items with underline for active and hover effect
    const desktopMenuItems = menuItems.map((item) => ({
        key: item.key,
        label: (
            <span
                style={{
                    position: 'relative',
                    color: selectedKey === item.key ? primaryColor : '#333',
                    fontWeight: selectedKey === item.key ? 600 : 400,
                    paddingBottom: 4,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = secondaryColor;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                        selectedKey === item.key ? primaryColor : '#333';
                }}
            >
                {item.label}
                {selectedKey === item.key && (
                    <span
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: 2,
                            backgroundColor: primaryColor,
                            borderRadius: 2,
                        }}
                    />
                )}
            </span>
        ),
    }));

    return (
        <Header
            suppressHydrationWarning
            style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                background: whiteColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                height: 80,
            }}
        >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Image src="/JupiNextIcon.png" alt="JupiNext Logo" width={50} height={50} />
                <Image src="/JupiNextName.png"
                    alt="JupiNext Name Logo"
                    width={250}
                    height={100}
                />
            </div>

            {/* Desktop Menu */}
            <div className="desktop-menu">
                <ClientMenu
                    mode="horizontal"
                    disabledOverflow
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={desktopMenuItems}
                    style={{ borderBottom: 'none' }}
                />
            </div>

            {/* Mobile Menu Button */}
            <Button
                className="mobile-menu-btn"
                type="text"
                icon={<TiThMenuOutline style={{ color: secondaryColor, fontSize: 28 }} />}
                onClick={() => setDrawerOpen(true)}
            />

            {/* Mobile Drawer */}
            <ClientDrawer
                placement="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {menuItems.map((item) => (
                    <div
                        key={item.key}
                        onClick={() => handleMenuClick({ key: item.key })}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            cursor: 'pointer',
                            backgroundColor:
                                selectedKey === item.key
                                    ? hexToRgba(primaryColor, 0.2)
                                    : 'transparent',
                            borderBottom: `1px solid ${accentColor}80`,
                            borderRadius: 8,
                            margin: '4px 0',
                        }}
                    >
                        <span
                            style={{
                                color:
                                    selectedKey === item.key
                                        ? secondaryColor
                                        : primaryColor,
                                fontWeight: selectedKey === item.key ? 600 : 400,
                            }}
                        >
                            {item.label}
                        </span>
                        {selectedKey === item.key && (
                            <CiSquareCheck
                                style={{
                                    color: secondaryColor,
                                    fontSize: 20,
                                }}
                            />
                        )}
                    </div>
                ))}
            </ClientDrawer>
        </Header>
    );
}
