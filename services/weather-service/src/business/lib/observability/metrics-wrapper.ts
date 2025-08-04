import {
  incrementExternalApiRequest,
  observeExternalApiRequestDuration,
} from "../observability";

export async function withApiMetrics<T>(
  providerName: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  let responseStatus = "failure";

  try {
    const result = await apiCall();
    responseStatus = "success";
    return result;
  } finally {
    const durationInSeconds = (Date.now() - startTime) / 1000;
    observeExternalApiRequestDuration(providerName, durationInSeconds);
    incrementExternalApiRequest(providerName, responseStatus);
  }
}
