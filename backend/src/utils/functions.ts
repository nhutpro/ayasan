export function formatYMDToDMY(ymdStr: string | undefined): string {
    if (!ymdStr) return '';
    const [year, month, day] = ymdStr.split('-');
    return `${day}/${month}/${year}`;
}

export function getUTC_HHmm(utcStr: string | undefined): string {
    if (!utcStr) return '';
    const date = new Date(utcStr);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function utcToYYYYMMDD(utcStr: string | undefined): string {
    if (!utcStr) return '';
    return utcStr.split('T')[0];
}