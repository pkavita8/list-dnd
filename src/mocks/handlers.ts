import { http, HttpResponse } from "msw";
import { API_URL } from "../constants";

const loadOrder = () => {
  const savedOrder = localStorage.getItem("order");
  return savedOrder ? JSON.parse(savedOrder) : [];
};

const saveOrder = (order: any) => {
  localStorage.setItem("order", JSON.stringify(order));
};

export const handlers = [
  http.get(API_URL, () => {
    return HttpResponse.json(loadOrder());
  }),

  http.post(API_URL, async ({ request }) => {
    const newOrder = await request.json()

    saveOrder(newOrder);

    return HttpResponse.json({
      status: 201,
      message: "Cards order saved successfully",
    });
  }),

];
