'use client';
import FooterComponent from '@/components/Footer';
import Headers from '@/components/Header';
import TimeClockScreen from '@/components/TimeClock/TimeClockScreen';

export default function TimeClockPage() {
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
                <TimeClockScreen />
            </div>
            <FooterComponent />
        </>
    );
}
