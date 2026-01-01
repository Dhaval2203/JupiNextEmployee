import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

const Api = axios.create({
    baseURL: API,
    headers: { 'Content-Type': 'application/json' },
});

export const FetchTodayTimeClock = (employeeId) =>
    Api.get(`/timeclock/today/${employeeId}`);

export const FetchMonthTimeClock = (employeeId, month) =>
    Api.get(`/timeclock/month/${employeeId}?month=${month}`);

export const StartShift = (employeeId) =>
    Api.post('/timeclock/start', { employeeId });

export const EndShift = (employeeId) =>
    Api.post('/timeclock/end', { employeeId });

export const AddBreak = (employeeId, breakSeconds) =>
    Api.post('/timeclock/break', { employeeId, breakSeconds });
