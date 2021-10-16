export interface TypeformAnswer {
  type: string,
  number?: number,
  boolean?: boolean,
  text?: string,
  choice: {
    label: string,
  },
  field:{
      id: string,
      type: string,
      ref: string,
  }
}
export interface Sort {
  field: string;
  direction?: 'asc' | 'desc' | undefined;
}

export interface AirtableOrder {
  id: string;
  "Total Ratings Submitted": number;
  "Number of Packages": number;
  "Rating Completion": number;
  "Shipping Date": string;
}

export interface Order {
  id: string;
  packageNumber: number;
  ratingsComplete: number;
  totalPouches: number;
  completePercentage: number;
  date: string;
}

export interface AirtablePouch {
  id: string;
  "Name (from Coffee)": string;
  "Name (from Roaster) (from Coffee)": string;
  "Origin (from Coffee)": string;
  "Taste (from Tasting Notes) (from Coffee)": string;
  "URL": string;
  "Has_Rated?": string;
  "Coffee_Link": string;
  "Enjoyment Level Rollup (from Ratings)": string;
  "Rating Rollup (from Ratings)": string;
  "Notes Rollup (from Ratings)": string;
}

export interface Pouch {
  id: string;
  order: number;
  coffee: string;
  roaster: string;
  origin: string;
  roasterTastingNotes: string;
  coffeeLink: string;
  hasRated: boolean;
  ratingLink: string;
  rating?: {
    enjoymentLevel: string;
    score: string;
    userTastingNotes: string;
  }
}