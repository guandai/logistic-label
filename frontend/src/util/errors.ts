import axios, { AxiosError } from "axios";
import { MessageContent, ResError } from "../types.d";
import React from "react";

export type SetMessage = (value: React.SetStateAction<MessageContent>) => void;

const tryError = (setMessage: SetMessage, error: any) => {
  const errorData = ((error as AxiosError).response?.data as ResError);
  let message = 'Failed to perform the operation.';
  const errors = errorData?.errors;
  if (errors && errors.length > 0) {
    message = errors[0].message;
  } else if (errorData?.message) {
    message = errorData.message;
  }
  setMessage({ text: message, level: 'error' });
}

export const tryLoad = async <T, P = void>(
  setMessage: SetMessage,
  callback: () => Promise<T>,
  errorCallback?: () => Promise<P>
) => {
  try {
    return await callback();
  } catch (error) {
    tryError(setMessage, error);
    return errorCallback ? await errorCallback() : '';
  }
}

export const loadApi = async<T>(
  setMessage: SetMessage,
  path: string,
  params: unknown
) => tryLoad<T>(setMessage, async () => {
  const responst = await axios.get<T>(
    `${process.env.REACT_APP_BE_URL}/${path}`, 
    { params });
  return responst.data;
})
