import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function getTotalRevenue() {
  const response = await axios.get(`${API_BASE_URL}/analytics/total-revenue`);
  return response.data;
}

export async function getRevenueByCategory() {
  const response = await axios.get(`${API_BASE_URL}/analytics/revenue-by-category`);
  return response.data;
}

export async function getEventCounts() {
  const response = await axios.get(`${API_BASE_URL}/analytics/event-counts`);
  return response.data;
}

export async function getConversionRates() {
  const response = await axios.get(`${API_BASE_URL}/analytics/conversion-rates`);
  return response.data;
}

export async function getUnderperformingProducts() {
  const response = await axios.get(`${API_BASE_URL}/analytics/underperforming-products`);
  return response.data;
}

export async function getMonthlyRevenue() {
  const response = await axios.get(`${API_BASE_URL}/analytics/monthly-revenue`);
  return response.data;
}

export async function getMonthlyGrowth() {
  const response = await axios.get(`${API_BASE_URL}/analytics/monthly-growth`);
  return response.data;
}

export async function getAbandonedCarts() {
  const response = await axios.get(`${API_BASE_URL}/analytics/abandoned-carts`);
  return response.data;
}

export async function getRevenueForecast() {
  const response = await axios.get(`${API_BASE_URL}/forecast/revenue`);
  return response.data;
}

export async function getRecommendations(userId) {
  const response = await axios.get(`${API_BASE_URL}/recommendations/${userId}`);
  return response.data;
}