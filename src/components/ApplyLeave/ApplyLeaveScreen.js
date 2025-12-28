import { getFullApprovers } from "@/Utils/approvers";
import {
    accentColor, primaryBackgroundColor,
    primaryColor, secondaryColor, whiteColor
} from "@/Utils/Colors";
import { EMPLOYEE_DATA, LEAVE_BALANCE } from "@/Utils/Const";
import { showToast } from "@/Utils/toast";
import { calculateLeaveDays, } from "@/Utils/UtilsFunction";
import {
    Avatar, Button,
    Card, Col,
    DatePicker, Divider,
    Input, Row,
    Segmented, Select,
    Space, Tag,
    Tooltip, Typography,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

/* ---------------- Component ---------------- */
export default function ApplyLeaveScreen() {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [dates, setDates] = useState([]);
    const [startLeaveType, setStartLeaveType] = useState("full");
    const [endLeaveType, setEndLeaveType] = useState("full");
    const [reason, setReason] = useState("");

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
    const approvers = useMemo(() => getFullApprovers(selectedEmployee), [selectedEmployee]);

    /* ---------------- Submit ---------------- */
    const handleSubmit = () => {
        if (!selectedEmployee || dates.length !== 2 || !reason) {
            showToast("error", "Validation", "Please fill all required fields");
            return;
        }

        if (totalLeaves <= 0) {
            showToast("error", "Invalid Leave", "Selected leave is invalid");
            return;
        }

        const payload = {
            employeeId: selectedEmployee.employeeId,
            fromDate: dayjs(dates[0]).format("DD-MMM-YYYY"),
            toDate: dayjs(dates[1]).format("DD-MMM-YYYY"),
            dayType: isSameDay ? startLeaveType : null,
            startDayType: !isSameDay ? startLeaveType : null,
            endDayType: !isSameDay ? endLeaveType : null,
            totalLeaveDays: totalLeaves,
            reason,
            approvers: approvers.map((a) => ({ id: a.employeeId, name: a.employeeName })),
        };

        console.log("Leave Applied:", payload);
        showToast("success", "Success", "Leave applied successfully");
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

            {/* Main Content */}
            <Row gutter={24}>
                {/* Left: Form */}
                <Col span={16}>
                    {/* Employee Select */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text strong>Select Employee</Text>
                            <Select
                                showSearch
                                placeholder="Search employee"
                                options={employeeOptions}
                                style={{ width: "100%", marginTop: 6 }}
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
                        <Col span={12}>
                            <Text strong>Leave Date Range</Text>
                            <RangePicker
                                style={{ width: "100%", marginTop: 6 }}
                                onChange={(val) => setDates(val || [])}
                            />
                        </Col>
                    </Row>

                    {/* Half Day Controls */}
                    {dates.length === 2 && (
                        <Row gutter={16} style={{ marginTop: 20 }}>
                            {(() => {
                                const renderLeaveType = (label, value, setValue) => (
                                    <Col span={12}>
                                        <Text strong>{label}</Text>
                                        <Segmented
                                            block
                                            options={[
                                                { label: "Full Day", value: "full" },
                                                { label: "Half Day", value: "half" },
                                            ]}
                                            value={value}
                                            onChange={setValue}
                                            style={{
                                                marginTop: 8,
                                                background: "#F3F4F6",
                                                color: "#fff",
                                            }}
                                        />
                                    </Col>
                                );

                                if (totalLeaves <= 1) {
                                    // Only one selector for single-day leave
                                    return renderLeaveType("Leave Type", startLeaveType, setStartLeaveType);
                                }
                                // Multi-day leave: show start and end selectors
                                return (
                                    <>
                                        {renderLeaveType("Start Day Type", startLeaveType, setStartLeaveType)}
                                        {renderLeaveType("End Day Type", endLeaveType, setEndLeaveType)}
                                    </>
                                );
                            })()}
                        </Row>
                    )}


                    {/* Reason */}
                    <Row style={{ marginTop: 24 }}>
                        <Col span={24}>
                            <Text strong>Reason</Text>
                            <Input.TextArea
                                rows={4}
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
                            style={{ marginRight: 12, background: secondaryColor, color: "#fff" }}
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
                            onClick={handleSubmit}
                            disabled={totalLeaves === 0}
                        >
                            Apply Leave
                        </Button>
                    </Row>
                </Col>

                {/* Right: Employee Info + Approvers */}
                <Col span={8}>
                    {selectedEmployee && (
                        <Card
                            style={{
                                position: "sticky",
                                top: 0,
                                background: "#F3F4F6",
                                borderLeft: `5px solid ${accentColor}`,
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Text strong style={{ color: primaryColor }}>Name:</Text>{" "}
                                    <Text>{selectedEmployee.employeeName}</Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong style={{ color: secondaryColor }}>Department:</Text>{" "}
                                    <Text>{selectedEmployee.department}</Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong style={{ color: accentColor }}>Designation:</Text>{" "}
                                    <Text>{selectedEmployee.designation}</Text>
                                </Col>
                            </Row>

                            <Divider />

                            <Row gutter={12} style={{ marginBottom: 8 }}>
                                <Col>
                                    <Tag color={primaryColor}>Casual Leave: {LEAVE_BALANCE.CL}</Tag>
                                </Col>
                                <Col>
                                    <Tag color={secondaryColor}>Sick Leave: {LEAVE_BALANCE.SL}</Tag>
                                </Col>
                                <Col>
                                    <Tag color={accentColor}>Privilege Leave: {LEAVE_BALANCE.PL}</Tag>
                                </Col>
                            </Row>

                            <Divider />

                            {/* Approvers */}
                            <Text strong>Approvers: </Text>
                            <Space size="small" wrap style={{ marginTop: 8 }}>
                                {approvers
                                    .filter(a => a)
                                    .map((a) => (
                                        <Tooltip
                                            key={a.employeeId}
                                            placement="bottom"
                                            color={primaryBackgroundColor} // background
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
                    )}
                </Col>
            </Row>
        </Card>
    );
}
