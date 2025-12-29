import {
    primaryColor,
    secondaryColor,
    whiteColor
} from "@/Utils/Colors";
import { EMPLOYEE_DATA } from "@/Utils/Const";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            employeeId,
            fromDate,
            toDate,
            totalLeaveDays,
            reason,
            approvers = [],
        } = body;

        /* ---------------- Employee ---------------- */
        const employee = EMPLOYEE_DATA.find(
            (e) => e.employeeId === employeeId
        );

        if (!employee) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        /* ---------------- Approvers in CC ---------------- */
        const approverEmails = [
            ...new Set(
                approvers
                    .map(
                        (id) =>
                            EMPLOYEE_DATA.find(
                                (e) => e.employeeId === id
                            )?.primaryEmail
                    )
                    .filter(Boolean)
            ),
        ];

        const approverNames = approvers
            .map(
                (id) =>
                    EMPLOYEE_DATA.find(
                        (e) => e.employeeId === id
                    )?.employeeName
            )
            .filter(Boolean)
            .join(", ");

        /* ---------------- Mail Transport ---------------- */
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL_USER,
                pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
            },
        });

        /* ---------------- Send Mail ---------------- */
        await transporter.sendMail({
            from: `"HR Team" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
            to: employee.primaryEmail,
            cc: approverEmails,
            subject: `Leave Application - ${employee.employeeName}`,
            html: `
<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#F8FAFC;padding:24px;font-family:Arial,sans-serif;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                style="background:${whiteColor};
                border-radius:12px;
                overflow:hidden;
                box-shadow:0 8px 24px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td style="background:${primaryColor};padding:20px 24px;">
                        <h2 style="margin:0;color:${whiteColor};font-size:22px;">
                            Leave Application Submitted
                        </h2>
                        <p style="margin:6px 0 0;color:#E5E7EB;font-size:14px;">
                            ${fromDate} to ${toDate}
                        </p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:24px;color:#111827;font-size:14px;line-height:1.6;">
                        <p style="margin-top:0;">
                            Dear
                            <strong style="color:${primaryColor};">
                                ${employee.employeeName}
                            </strong>,
                        </p>

                        <p>
                            Your leave request has been successfully submitted.
                            Below are the details of your application:
                        </p>

                        <!-- Leave Details -->
                        <table width="100%" cellpadding="0" cellspacing="0"
                            style="background:#F1F5F9;
                            border-left:4px solid ${primaryColor};
                            margin:20px 0;">
                            <tr>
                                <td style="padding:14px 16px;font-size:13px;color:#1F2937;">
                                    📅 <strong>From:</strong> ${fromDate}<br/>
                                    📅 <strong>To:</strong> ${toDate}<br/>
                                    🧮 <strong>Total Leave Days:</strong> ${totalLeaveDays}<br/>
                                    📝 <strong>Reason:</strong> ${reason}
                                </td>
                            </tr>
                        </table>

                        <!-- Approval Info -->
                        <p>
                            <strong>Approval Workflow:</strong><br/>
                            Your request has been forwarded to the following approver(s):
                        </p>

                        <p style="margin-left:12px;color:${secondaryColor};">
                            👤 ${approverNames || "Reporting Manager / HR"}
                        </p>

                        <p>
                            You will be notified once your leave request is
                            approved or rejected.
                        </p>

                        <!-- NEW: Approval Timeline -->
                        <p>
                            <strong>Expected Timeline:</strong><br/>
                            Most leave requests are reviewed within
                            <strong> 1–2 working days</strong>.
                            Delays may occur during peak periods or holidays.
                        </p>

                        <!-- NEW: Responsibilities Reminder -->
                        <p style="background:#F9FAFB;padding:12px 14px;border-radius:8px;">
                            💡 <strong>Important Reminder:</strong><br/>
                            Please ensure:
                            <ul style="margin:8px 0 0 18px;padding:0;">
                                <li>Proper task handover to your backup</li>
                                <li>Out-of-office email is configured</li>
                                <li>Critical deadlines are communicated in advance</li>
                            </ul>
                        </p>

                        <!-- NEW: Policy Note -->
                        <p style="font-size:13px;color:#374151;">
                            <strong>Leave Policy Note:</strong><br/>
                            Leave approval is subject to company policy and
                            business requirements. Any discrepancies in leave
                            balance or dates may result in modification or rejection.
                        </p>

                        <!-- NEW: Support Info -->
                        <p style="font-size:13px;color:#374151;">
                            <strong>Need Help?</strong><br/>
                            For corrections or urgent matters, please reach out
                            to the HR team or your reporting manager directly.
                        </p>

                        <!-- Signature -->
                        <p style="margin-top:24px;margin-bottom:0;">
                            Best regards,<br/>
                            <strong style="color:${primaryColor};">
                                HR Team
                            </strong>
                        </p>

                        <!-- Brand -->
                        <div style="margin-top:16px;font-size:15px;font-weight:700;">
                            <span style="color:${primaryColor};">Jupi</span>
                            <span style="color:${secondaryColor};">Next</span>
                        </div>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td
                        style="background:#F9FAFB;
                        padding:14px 24px;
                        text-align:center;
                        font-size:12px;
                        color:#6B7280;">
                        This is an automated email. Please do not reply directly.
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>
            `,
        });

        return NextResponse.json({
            message: "Leave email sent successfully",
            to: employee.primaryEmail,
            cc: approverEmails,
        });
    } catch (error) {
        console.error("APPLY LEAVE EMAIL ERROR:", error);
        return NextResponse.json(
            { error: "Failed to send leave email" },
            { status: 500 }
        );
    }
}
