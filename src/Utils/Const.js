export const comapnyName = "JupiNext";
export const companyEmail = "info@jupinext.com";
export const companyPhone = "+91 98765 43210";
export const CEOemployeeId = "JN-1";
export const CTOemployeeId = "JN-2";

export const menuItems = [
    { key: "timeclock", label: 'Time Clock' },
    { key: "applyleave", label: "Apply Leave" },
]

export const notificationType = {
    success: 'success',
    error: 'error',
    info: 'info'
}
/* ----------------------------------
 Mock Employee Data
----------------------------------- */
export const EMPLOYEE_DATA = [
    {
        employeeId: 'JN-1',
        employeeName: 'Deepali',
        designation: 'CTO',
        department: 'Management',
        doj: '12-Jan-2020',
        dob: '05-May-1992',
        bankName: 'HDFC Bank',
        bankAccount: '502134789654',
        primaryEmail: 'deepalishrivastava921@gmail.com',
        secondaryEmail: 'deepali.alt@gmail.com',
        reportingManagerId: null,
        isActive: true
    },
    {
        employeeId: 'JN-2',
        employeeName: 'Dhaval Parekh',
        designation: 'CEO',
        department: 'Technology',
        doj: '12-Jan-2020',
        dob: '22-Mar-1998',
        bankName: 'HDFC Bank',
        bankAccount: '502134789654',
        primaryEmail: 'parekhdhaval1998@gmail.com',
        secondaryEmail: 'parekhdhaval2203@gmail.com',
        reportingManagerId: null,
        isActive: true
    },
    {
        employeeId: 'JN-3',
        employeeName: 'Amit Sharma',
        designation: 'QA Engineer',
        department: 'Quality Assurance',
        doj: '10-Feb-2022',
        dob: '14-Aug-1995',
        bankName: 'SBI',
        bankAccount: '123456789012',
        primaryEmail: 'parekhdhaval1998@gmail.com',
        secondaryEmail: 'parekhdhaval2203@gmail.com',
        reportingManagerId: 'JN-2',
        isActive: true
    },
    {
        employeeId: 'JN-4',
        employeeName: 'Priya Mehta',
        designation: 'HR Manager',
        department: 'Human Resources',
        doj: '15-Mar-2021',
        dob: '09-Dec-1990',
        bankName: 'Axis Bank',
        bankAccount: '987654321098',
        primaryEmail: 'priya.mehta@gmail.com',
        secondaryEmail: 'priya.alt@gmail.com',
        reportingManagerId: 'JN-3',
        isActive: true
    },
    {
        employeeId: 'JN-5',
        employeeName: 'Rohan Gupta',
        designation: 'UI/UX Designer',
        department: 'Design',
        doj: '20-Apr-2022',
        dob: '27-Jun-1996',
        bankName: 'Kotak Bank',
        bankAccount: '564738291012',
        primaryEmail: 'rohan.gupta@gmail.com',
        secondaryEmail: 'rohan.alt@gmail.com',
        reportingManagerId: 'JN-2',
        isActive: true
    },
    {
        employeeId: 'JN-6',
        employeeName: 'Neha Singh',
        designation: 'Software Engineer',
        department: 'Engineering',
        doj: '18-Jul-2021',
        dob: '11-Feb-1994',
        bankName: 'SBI',
        bankAccount: '334455667788',
        primaryEmail: 'neha.singh@gmail.com',
        secondaryEmail: 'neha.alt@gmail.com',
        reportingManagerId: 'JN-3',
        isActive: true
    },
    {
        employeeId: 'JN-7',
        employeeName: 'Vikas Yadav',
        designation: 'DevOps Engineer',
        department: 'Technology',
        doj: '12-Jun-2022',
        dob: '03-Oct-1993',
        bankName: 'HDFC Bank',
        bankAccount: '223344556677',
        primaryEmail: 'vikas.yadav@gmail.com',
        secondaryEmail: 'vikas.alt@gmail.com',
        reportingManagerId: 'JN-2',
        isActive: true
    },
    {
        employeeId: 'JN-8',
        employeeName: 'Shreya Ghosh',
        designation: 'Business Analyst',
        department: 'Business',
        doj: '18-Jul-2021',
        dob: '19-Jan-1995',
        bankName: 'ICICI Bank',
        bankAccount: '161718192021',
        primaryEmail: 'shreya.ghosh@gmail.com',
        secondaryEmail: 'shreya.alt@gmail.com',
        reportingManagerId: 'JN-4',
        isActive: true
    },
    {
        employeeId: 'JN-9',
        employeeName: 'Karan Thakur',
        designation: 'System Admin',
        department: 'IT Support',
        doj: '25-Aug-2022',
        dob: '07-Jul-1992',
        bankName: 'Kotak Bank',
        bankAccount: '171819202122',
        primaryEmail: 'karan.thakur@gmail.com',
        secondaryEmail: 'karan.alt@gmail.com',
        reportingManagerId: 'JN-3',
        isActive: true
    },
    {
        employeeId: 'JN-10',
        employeeName: 'Ritika Sharma',
        designation: 'Content Strategist',
        department: 'Marketing',
        doj: '30-Sep-2021',
        dob: '16-Nov-1997',
        bankName: 'HDFC Bank',
        bankAccount: '181920212223',
        primaryEmail: 'parekhdhaval1998@gmail.com',
        secondaryEmail: 'parekhdhaval2203@gmail.com',
        reportingManagerId: 'JN-9',
        isActive: true
    }
];

export const LEAVE_BALANCE = {
    CL: 8,   // Casual Leave
    SL: 6,   // Sick Leave
    PL: 12,  // Privilege Leave
};

export const earningsData = [
    { key: 'basic', label: 'Basic', name: 'basic' },
    { key: 'hra', label: 'HRA', name: 'hra' },
    { key: 'telephone', label: 'Telephone', name: 'telephone' },
    { key: 'internet', label: 'Internet', name: 'internet' },
    { key: 'cityAllowance', label: 'City Allowance', name: 'cityAllowance' },
];

export const deductionsData = [
    { key: 'pt', label: 'PT', name: 'pt' },
    { key: 'pf', label: 'PF', name: 'pf' },
    { key: 'esic', label: 'ESIC', name: 'esic' },
    { key: 'tds', label: 'TDS', name: 'tds' },
    { key: 'lop', label: 'LOP', name: 'lop' },
];

export const positiveAchievements = [
    'Consistently exceeded performance targets and deadlines.',
    'Led key projects resulting in measurable business improvements.',
    'Demonstrated strong problem-solving and analytical skills.',
    'Received appreciation from clients and senior management for exemplary work.',
];

export const positiveSkills = [
    'Team collaboration and coordination',
    'Leadership and initiative',
    'Communication and interpersonal skills',
    'Technical proficiency in core responsibilities',
];

export const negativeConcerns = [
    'Failed to consistently meet performance targets.',
    'Struggled with time management and meeting deadlines.',
    'Required frequent supervision for assigned tasks.',
    'Had challenges in adapting to team processes and procedures.',
];

export const negativeImprovements = [
    'Needs to enhance technical proficiency.',
    'Improve communication and collaboration skills.',
    'Develop problem-solving and decision-making abilities.',
    'Focus on time management and accountability.',
];

export function DSquareIcon() {
    return (
        <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="6"
                y="6"
                width="52"
                height="52"
                rx="10"
                fill="none"
                stroke="#0ea5a4"
                stroke-width="4"
            />

            <rect
                x="18"
                y="18"
                width="28"
                height="28"
                rx="6"
                fill="none"
                stroke="#ef4444"
                stroke-width="3"
            />

            <text
                x="32"
                y="40"
                text-anchor="middle"
                font-size="22"
                font-weight="700"
                fill="#0ea5a4"
                font-family="Arial, Helvetica, sans-serif"
            >
                D
            </text>
        </svg >
    )
}

export function DSquareIconForCareerPage() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="6"
                y="6"
                width="52"
                height="52"
                rx="10"
                fill="none"
                stroke="#0ea5a4"
                strokeWidth="4"
            />

            <rect
                x="18"
                y="18"
                width="28"
                height="28"
                rx="6"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
            />
        </svg>
    );
}
