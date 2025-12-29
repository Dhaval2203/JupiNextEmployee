'use client';

import {
    accentColor,
    primaryColor,
    secondaryColor,
    whiteColor,
} from "@/Utils/Colors";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";

const { Title, Text } = Typography;

export default function ConfirmApplyLeaveModal({
    open,
    onCancel,
    onConfirm,
    loading,
    totalLeaves,
    employeeName,
}) {
    return (
        <Modal
            open={open}
            footer={null}
            onCancel={onCancel}
            centered
            width={460}
        >
            {/* ---------- Header ---------- */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: `1px solid #E5E7EB`,
                }}
            >
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: secondaryColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: whiteColor,
                        fontSize: 20,
                    }}
                >
                    <ExclamationCircleFilled />
                </div>

                <div>
                    <Title level={4} style={{ margin: 0, color: primaryColor }}>
                        Confirm Leave Application
                    </Title>
                    <Text type="secondary" style={{ color: accentColor }}>
                        Please review before submitting
                    </Text>
                </div>
            </div>

            {/* ---------- Body ---------- */}
            <div style={{ padding: "4px 2px 16px" }}>
                <Text style={{ fontSize: 15 }}>
                    Are you sure you want to apply for{" "}
                    <Text strong style={{ color: primaryColor }}>
                        {totalLeaves}
                    </Text>{" "}
                    day(s) of leave
                    {employeeName && (
                        <>
                            {" "}for{" "}
                            <Text strong style={{ color: secondaryColor }}>
                                {employeeName}
                            </Text>
                        </>
                    )}
                    ?
                </Text>

                <div
                    style={{
                        marginTop: 12,
                        padding: 12,
                        borderRadius: 8,
                        background: "#F9FAFB",
                        borderLeft: `4px solid ${accentColor}`,
                    }}
                >
                    <Text type="secondary">
                        Once applied, the leave request will be sent to approvers
                        via email and cannot be edited.
                    </Text>
                </div>
            </div>

            {/* ---------- Footer ---------- */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 12,
                    paddingTop: 16,
                    borderTop: "1px solid #E5E7EB",
                }}
            >
                <Button
                    onClick={onCancel}
                    disabled={loading}
                    style={{
                        borderRadius: 8,
                        color: secondaryColor,
                    }}
                >
                    Cancel
                </Button>

                <Button
                    type="primary"
                    loading={loading}
                    onClick={onConfirm}
                    style={{
                        background: primaryColor,
                        borderColor: primaryColor,
                        borderRadius: 8,
                        fontWeight: 600,
                    }}
                >
                    Yes, Apply Leave
                </Button>
            </div>
        </Modal>
    );
}
