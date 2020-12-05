
export const isDate = (o?: unknown): o is Date => o instanceof Date && !isNaN(o.getTime());

export const days = {

  add: (date: Date, days: number): Date => {
    date.setDate(date.getDate() + days);
    return date;
  },
  today: (): Date => new Date(),
  yesterday: (): Date => days.add(days.today(), -1),
  tomorrow: (): Date => days.add(days.today(), 1)
}

export const inPast = (o?: unknown): boolean => isDate(o) && o <= days.today();

export const inFuture = (o?: unknown): boolean => isDate(o) && o > days.today();
