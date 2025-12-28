import { EMPLOYEE_DATA, CEOemployeeId, CTOemployeeId } from "./Const";

/**
 * Get all unique approvers for a selected employee.
 * CEO will always be last, CTO second last.
 * @param {object} employee - Selected employee object
 * @returns {Array} - List of approver objects
 */
export const getFullApprovers = (employee) => {
    if (!employee) return [];

    const approvers = [];
    const addedIds = new Set();

    const addApprover = (emp) => {
        if (!emp || addedIds.has(emp.employeeId)) return;
        addedIds.add(emp.employeeId);
        approvers.push(emp);

        // Recursively add manager
        if (emp.reportingManagerId) {
            const manager = EMPLOYEE_DATA.find(
                (e) => e.employeeId === emp.reportingManagerId
            );
            addApprover(manager);
        }
    };

    // Add parent-level managers first
    if (employee.reportingManagerId) {
        const manager = EMPLOYEE_DATA.find(
            (e) => e.employeeId === employee.reportingManagerId
        );
        addApprover(manager);
    }

    // Add CTO second last
    const CTO = EMPLOYEE_DATA.find((e) => e.employeeId === CTOemployeeId);
    if (CTO && !addedIds.has(CTO.employeeId) && employee.employeeId !== CTOemployeeId) {
        approvers.push(CTO);
        addedIds.add(CTO.employeeId);
    }

    // Add CEO last
    const CEO = EMPLOYEE_DATA.find((e) => e.employeeId === CEOemployeeId);
    if (CEO && !addedIds.has(CEO.employeeId) && employee.employeeId !== CEOemployeeId) {
        approvers.push(CEO);
        addedIds.add(CEO.employeeId);
    }

    return approvers;
};
