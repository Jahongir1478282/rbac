/* eslint-disable @typescript-eslint/no-unused-vars */
import { date } from './date';

export const orderItemByDate = (data: any) => {
  const { createdAt, updatedAt, ...result } = data;
  return {
    ...result,
    createdAt: date(data.createdAt),
    updatedAt: data.updatedAt ? date(data.updatedAt) : null,
  };
};

export const orderItemsByDate = (data: any) => {
  const newData = (data.items || []).map((item: any) => {
    const { createdAt, updatedAt, ...result } = item;
    return {
      ...result,
      createdAt: date(item.createdAt),
      updatedAt: item.updatedAt ? date(item.updatedAt) : null,
    };
  });
  return { ...data, items: newData };
};
