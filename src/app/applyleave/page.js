'use client';
import ApplyLeaveScreen from '@/components/ApplyLeave/ApplyLeaveScreen';
import FooterComponent from '@/components/Footer';
import Headers from '@/components/Header';

export default function ApplyLeave() {
    return (
        <>
            <Headers />
            <div
                style={{
                    paddingTop: typeof window !== 'undefined' && window.innerWidth < 768 ? 64 : 80,
                    paddingInline: 12,
                    minHeight: '100vh',
                }}
            >
                <ApplyLeaveScreen />
            </div>
            <FooterComponent />
        </>
    );
}
