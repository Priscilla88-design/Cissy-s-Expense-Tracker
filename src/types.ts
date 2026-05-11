export type Category = 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Health' | 'Shopping' | 'Other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  aiCategorized: boolean;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ExpenseFilters {
  search: string;
  categories: Category[];
  dateRange: {
    start: string;
    end: string;
  };
  amountRange: {
    min: number;
    max: number;
  };
}

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#F87171',
  Transport: '#60A5FA',
  Utilities: '#FBBF24',
  Entertainment: '#A78BFA',
  Health: '#34D399',
  Shopping: '#F472B6',
  Other: '#9CA3AF',
};
