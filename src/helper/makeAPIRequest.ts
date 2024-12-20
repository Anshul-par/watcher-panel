import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Utility function to make a request using axios.
 *
 * @param {AxiosRequestConfig} config - Axios request configuration object.
 * @returns {Promise<{ success: boolean; data?: any; status?: number; headers?: any; message?: string; }>}
 */
export const makeAPIRequest = async (
  config: AxiosRequestConfig
): Promise<{
  success: boolean;
  data?: any;
  status?: number;
  headers?: any;
  message?: string;
}> => {
  try {
    // Validate and set default values if necessary
    const defaultConfig: AxiosRequestConfig = {
      method: "GET",
      timeout: 10000, // Default timeout of 10 seconds
      headers: {},
      data: {}, // Default empty body for compatibility
    };

    // Merge user-provided config with default values
    const finalConfig: AxiosRequestConfig = { ...defaultConfig, ...config };

    // Make the request
    const response: AxiosResponse = await axios(finalConfig);
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error: any) {
    // Return detailed error information
    return {
      success: false,
      message: error.message,
      status: error.response ? error.response.status : null,
      data: error.response ? error.response.data : null,
    };
  }
};
