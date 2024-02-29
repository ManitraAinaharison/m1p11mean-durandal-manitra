export interface Ebit {
  designation: string,
  ebitDate?: Date,
  month: number,
  year: number,
  expenses: { designation: string, amount: number }[],
  sales?: number,
  totalProfit?: number
}
