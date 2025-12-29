'use client';

import { getFullApprovers } from "@/Utils/approvers";
import {
    accentColor,
    primaryBackgroundColor,
    primaryColor,
    secondaryColor,
    whiteColor
} from "@/Utils/Colors";
import { EMPLOYEE_DATA, LEAVE_BALANCE } from "@/Utils/Const";
import { showToast } from "@/Utils/toast";
import { calculateLeaveDays } from "@/Utils/UtilsFunction";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Input,
    Row,
    Segmented,
    Select,
    Space,
    Tag,
    Tooltip,
    Typography,
    Spin,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import ConfirmApplyLeaveModal from "../ConfirmApplyLeaveModal";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

/* ---------------- Component ---------------- */
export default function ApplyLeaveScreen() {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [dates, setDates] = useState([]);
    const [startLeaveType, setStartLeaveType] = useState("full");
    const [endLeaveType, setEndLeaveType] = useState("full");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false); // 🔄 LOADING STATE
    const [confirmOpen, setConfirmOpen] = useState(false); // ✅ CONFIRM MODAL

    const isSameDay =
        dates.length === 2 &&
        dayjs(dates[0]).isSame(dayjs(dates[1]), "day");

    /* ---------------- Employee Options ---------------- */
    const employeeOptions = useMemo(
        () =>
            EMPLOYEE_DATA.map((emp) => ({
                value: emp.employeeId,
                label: `${emp.employeeId} - ${emp.employeeName}`,
            })),
        []
    );

    /* ---------------- Total Leave Calculation ---------------- */
    const totalLeaves = useMemo(() => {
        if (dates.length !== 2) return 0;
        return calculateLeaveDays(
            dates[0],
            dates[1],
            isSameDay ? startLeaveType : startLeaveType,
            isSameDay ? startLeaveType : endLeaveType
        );
    }, [dates, startLeaveType, endLeaveType, isSameDay]);

    /* ---------------- Get Approvers ---------------- */
    const approvers = useMemo(
        () => getFullApprovers(selectedEmployee),
        [selectedEmployee]
    );

    /* ---------------- Submit ---------------- */
    const submitLeave = async () => {
        try {
            setSubmitting(true);

            const payload = {
                employeeId: selectedEmployee.employeeId,
                fromDate: dayjs(dates[0]).format("DD-MMM-YYYY"),
                toDate: dayjs(dates[1]).format("DD-MMM-YYYY"),
                dayType: isSameDay ? startLeaveType : null,
                startDayType: !isSameDay ? startLeaveType : null,
                endDayType: !isSameDay ? endLeaveType : null,
                totalLeaveDays: totalLeaves,
                reason,
                approvers: approvers.map(a => a.employeeId),
            };

            const res = await fetch("/api/applyleave", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error();

            showToast("success", "Success", "Leave applied & email sent");

            // Reset
            setSelectedEmployee(null);
            setDates([]);
            setStartLeaveType("full");
            setEndLeaveType("full");
            setReason("");
        } catch {
            showToast("error", "Error", "Leave applied but email failed");
        } finally {
            setSubmitting(false);
            setConfirmOpen(false);
        }
    };

    /* ---------------- Open Confirm Modal ---------------- */
    const handleApplyClick = () => {
        if (!selectedEmployee || dates.length !== 2 || !reason) {
            showToast("error", "Validation", "Please fill all required fields");
            return;
        }

        if (totalLeaves <= 0) {
            showToast("error", "Invalid Leave", "Selected leave is invalid");
            return;
        }

        setConfirmOpen(true);
    };

    return (
        <Card style={{ borderRadius: 16, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}>
            {/* Header */}
            <Card
                style={{
                    background: primaryColor,
                    borderRadius: 14,
                    marginBottom: 24,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                }}
            >
                <Title level={3} style={{ color: "#fff", marginBottom: 0 }}>
                    Apply Leave
                </Title>
                <Text style={{ color: "#E5E7EB" }}>
                    Saturday & Sunday are automatically excluded
                </Text>
            </Card>

            <Row gutter={24}>
                {/* Left: Form */}
                <Col span={16}>
                    {/* Employee Select */}
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={8}>
                            <Text strong>Select Employee</Text>
                            <Select
                                showSearch
                                disabled={submitting}
                                placeholder="Search employee"
                                options={employeeOptions}
                                style={{ width: "100%", marginTop: 6 }}
                                value={selectedEmployee?.employeeId}
                                onChange={(value) =>
                                    setSelectedEmployee(
                                        EMPLOYEE_DATA.find(
                                            (emp) => emp.employeeId === value
                                        )
                                    )
                                }
                            />
                        </Col>
                    </Row>

                    {/* Leave Dates */}
                    <Row gutter={16} style={{ marginTop: 24 }}>
                        <Col xs={24} sm={24} md={12} lg={8}>
                            <Text strong>Leave Date Range</Text>
                            <RangePicker
                                disabled={submitting}
                                style={{ width: "100%", marginTop: 6 }}
                                value={dates}
                                onChange={(val) => setDates(val || [])}
                            />
                        </Col>
                    </Row>

                    {/* Half Day Controls */}
                    {dates.length === 2 && (
                        <Row gutter={16} style={{ marginTop: 20 }}>
                            {(() => {
                                const renderLeaveType = (label, value, setValue) => (
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <Text strong>{label}</Text>
                                        <Segmented
                                            block
                                            disabled={submitting}
                                            options={[
                                                { label: "Full Day", value: "full" },
                                                { label: "Half Day", value: "half" },
                                            ]}
                                            value={value}
                                            onChange={setValue}
                                            style={{ marginTop: 8 }}
                                        />
                                    </Col>
                                );

                                if (totalLeaves <= 1) {
                                    return renderLeaveType(
                                        "Leave Type",
                                        startLeaveType,
                                        setStartLeaveType
                                    );
                                }

                                return (
                                    <>
                                        {renderLeaveType(
                                            "Start Day Type",
                                            startLeaveType,
                                            setStartLeaveType
                                        )}
                                        {renderLeaveType(
                                            "End Day Type",
                                            endLeaveType,
                                            setEndLeaveType
                                        )}
                                    </>
                                );
                            })()}
                        </Row>
                    )}

                    {/* Reason */}
                    <Row style={{ marginTop: 24 }}>
                        <Col xs={24} sm={24} md={12} lg={8}>
                            <Text strong>Reason</Text>
                            <Input.TextArea
                                rows={4}
                                disabled={submitting}
                                placeholder="Enter reason for leave"
                                style={{ marginTop: 6 }}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </Col>
                    </Row>

                    {/* Summary */}
                    {totalLeaves > 0 && (
                        <Card
                            style={{
                                marginTop: 24,
                                background: "#f0f9ff",
                                borderLeft: `4px solid ${accentColor}`,
                            }}
                        >
                            <Text strong>Total Leave Days: </Text>
                            <Text style={{ color: accentColor, fontSize: 16 }}>
                                {totalLeaves}
                            </Text>
                        </Card>
                    )}

                    {/* Actions */}
                    <Row justify="end" style={{ marginTop: 24 }}>
                        <Button
                            disabled={submitting}
                            style={{
                                marginRight: 12,
                                background: secondaryColor,
                                color: "#fff",
                            }}
                            onClick={() => {
                                setSelectedEmployee(null);
                                setDates([]);
                                setStartLeaveType("full");
                                setEndLeaveType("full");
                                setReason("");
                            }}
                        >
                            Reset
                        </Button>

                        <Button
                            type="primary"
                            style={{ background: primaryColor }}
                            loading={submitting}
                            disabled={totalLeaves === 0 || submitting}
                            onClick={handleApplyClick}
                        >
                            {submitting ? "Applying..." : "Apply Leave"}
                        </Button>
                    </Row>
                </Col>

                {/* Right: Employee Info + Approvers */}
                <Col xs={24} sm={24} md={12} lg={8}>
                    {selectedEmployee && (
                        <Spin spinning={submitting}>
                            <Card
                                style={{
                                    position: "sticky",
                                    top: 0,
                                    background: "#F3F4F6",
                                    borderLeft: `5px solid ${accentColor}`,
                                }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <Text strong style={{ color: primaryColor }}>Name:</Text>{" "}
                                        <Text>{selectedEmployee.employeeName}</Text>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <Text strong style={{ color: secondaryColor }}>Department:</Text>{" "}
                                        <Text>{selectedEmployee.department}</Text>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <Text strong style={{ color: accentColor }}>Designation:</Text>{" "}
                                        <Text>{selectedEmployee.designation}</Text>
                                    </Col>
                                </Row>

                                <Divider />

                                <Row gutter={[12, 12]} style={{ marginBottom: 8 }}>
                                    <Col xs={24} sm={12} md={8}>
                                        <Tag color={primaryColor}>
                                            Casual Leave: {LEAVE_BALANCE.CL}
                                        </Tag>
                                    </Col>
                                    <Col xs={24} sm={12} md={8}>
                                        <Tag color={secondaryColor}>
                                            Sick Leave: {LEAVE_BALANCE.SL}
                                        </Tag>
                                    </Col>
                                    <Col xs={24} sm={12} md={8}>
                                        <Tag color={accentColor}>
                                            Privilege Leave: {LEAVE_BALANCE.PL}
                                        </Tag>
                                    </Col>
                                </Row>

                                <Divider />

                                <Text strong>Approvers:</Text>
                                <Space size="small" wrap style={{ marginTop: 8 }}>
                                    {approvers
                                        .filter(Boolean)
                                        .map((a) => (
                                            <Tooltip
                                                key={a.employeeId}
                                                placement="bottom"
                                                color={primaryBackgroundColor}
                                                title={
                                                    <span style={{ color: secondaryColor }}>
                                                        {a.employeeName} ({a.designation})
                                                    </span>
                                                }
                                            >
                                                <Avatar
                                                    size={32}
                                                    style={{
                                                        backgroundColor: primaryColor,
                                                        color: whiteColor,
                                                        fontWeight: "bold",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {a.employeeName[0]}
                                                </Avatar>
                                            </Tooltip>
                                        ))}
                                </Space>
                            </Card>
                        </Spin>
                    )}
                </Col>
            </Row>
            {/* ✅ CONFIRM MODAL */}
            <ConfirmApplyLeaveModal
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={submitLeave}
                loading={submitting}
                totalLeaves={totalLeaves}
                employeeName={selectedEmployee?.employeeName}
            />
        </Card>
    );
}
