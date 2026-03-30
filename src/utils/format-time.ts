import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string): string {
    const fm = newFormat || 'dd MMM yyyy';

    return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string): string {
    const fm = newFormat || 'dd MMM yyyy p';

    return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue): number | string {
    return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue): string {
    return date
        ? formatDistanceToNow(new Date(date), {
            addSuffix: true,
        })
        : '';
}
