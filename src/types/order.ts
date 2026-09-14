export interface CreateOrderItemDTO {
  batch_uuid: string;
  store_product_uuid: string;
  quantity: number;
}

export interface CreateOrderDTO {
  customer_uuid?: string;
  store_uuid: string;
  order_date: string;
  payment_method?: string;
  items: CreateOrderItemDTO[];
}


