export interface ResponseInterface {
  data?: object;
  message?: string;
}

export interface ApiResponseInterface extends ResponseInterface {
  status: boolean;
}
