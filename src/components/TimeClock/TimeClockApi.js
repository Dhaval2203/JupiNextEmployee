import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

const Api = axios.create({
    baseURL: API,
    headers: { 'Content-Type': 'application/json' },
});

/* ======================================================
   Time Clock APIs
   ====================================================== */

/**
 * Fetch today's time clock
 */
export const FetchTodayTimeClock = (employeeId) =>
    Api.get(`/timeclock/today/${employeeId}`);

/**
 * Fetch month-wise & year-wise time clock data
 *
 * @param {string} employeeId
 * @param {number} year   - YYYY (e.g. 2026)
 * @param {string|number} month - MM (01–12)
 */
export const FetchMonthTimeClock = (employeeId, year, month) =>
    Api.get(
        `/timeclock/month/${employeeId}?year=${year}&month=${month}`
    );

/**
 * Start shift (Punch In)
 */
export const StartShift = (employeeId) =>
    Api.post('/timeclock/start', { employeeId });

/**
 * End shift (Punch Out)
 */
export const EndShift = (employeeId) =>
    Api.post('/timeclock/end', { employeeId });

/**
 * Add break (in seconds)
 */
export const AddBreak = (employeeId, breakSeconds) =>
    Api.post('/timeclock/break', { employeeId, breakSeconds });

/* ================= ATTENDANCE ADJUSTMENT ================= */

/**
 * Request attendance adjustment (short hours)
 */
export const RequestAttendanceAdjustment = (payload) =>
    Api.post('/attendance-adjustment/request', payload);