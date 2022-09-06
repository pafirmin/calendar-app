import { isAfter, addDays } from 'date-fns';

export function dateRange(start: Date, end: Date) {
    const arr: Date[] = []
    let currDate = start;

    while (!isAfter(currDate, end)) {
      arr.push(currDate)
      currDate = new Date(addDays(currDate, 1))
    }

    return arr
}
