import { Typography } from "antd";
import { primaryColor, secondaryColor, whiteColor } from "../Colors";
const { Title, Text } = Typography;

export const previewModalProps = {
    width: '100%',
    style: { top: 20 },
    styles: {
        body: {
            height: '80vh',
            paddingTop: 12,
        },
    },
};

export const CustomCloseIcon = ({ primaryColor, secondaryColor }) => (
    <div
        style={{
            background: primaryColor + '20',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: secondaryColor,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = primaryColor + '40';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = primaryColor + '20';
        }}
    >
        ×
    </div>
);

export const PreviewModalHeader = ({ title }) => (
    <div
        style={{
            background: whiteColor,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            paddingBottom: 8,
        }}
    >
        <Title
            level={4}
            style={{
                fontWeight: 700,
                letterSpacing: '0.3px',
                lineHeight: 1.3,
                marginBottom: 6,
                background: `linear-gradient(
                    90deg,
                    ${primaryColor} 0%,
                    ${secondaryColor} 50%,
                    ${primaryColor} 100%
                )`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            {title}
        </Title>

        <div
            style={{
                height: 4,
                width: '100%',
                borderRadius: 4,
                background: `linear-gradient(90deg, ${primaryColor}80, ${secondaryColor}80)`,
            }}
        />
    </div>
);
