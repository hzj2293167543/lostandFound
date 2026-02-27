export interface FilterState {
  status: string;
  searchTerm: string;
  category: string;
}

export type SetFilterState = (key: keyof FilterState, value: string) => void;
