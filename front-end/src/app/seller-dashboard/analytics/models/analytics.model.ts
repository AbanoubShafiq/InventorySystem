export interface AnalyticsData {
  sales: {
    date: string;
    amount: number;
    count: number;
  }[];
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalSales: number;  // Added this missing property
  };
}