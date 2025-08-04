import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  downstreamRequestDurationSeconds,
  downstreamRequestsTotal,
} from "./metrics";

export class MetricsInterceptor {
  private static requestMetadata = new WeakMap<
    InternalAxiosRequestConfig,
    { startTime: Date }
  >();

  static setupInterceptors(client: AxiosInstance, serviceName: string) {
    client.interceptors.request.use((config) => {
      this.requestMetadata.set(config, { startTime: new Date() });

      return config;
    });

    client.interceptors.response.use(
      this.handleSuccess(serviceName),
      this.handleError(serviceName)
    );
  }

  private static handleSuccess(serviceName: string) {
    return (response: AxiosResponse) => {
      const metadata = this.requestMetadata.get(response.config);

      if (metadata) {
        const duration = (Date.now() - metadata.startTime.getTime()) / 1000;

        const route = new URL(response.config.url!, response.config.baseURL)
          .pathname;

        downstreamRequestDurationSeconds
          .labels(serviceName, route)
          .observe(duration);

        downstreamRequestsTotal
          .labels(serviceName, route, response.status.toString())
          .inc();
      }
      this.requestMetadata.delete(response.config);

      return response;
    };
  }

  private static handleError = (serviceName: string) => (error: AxiosError) => {
    if (error.config) {
      const metadata = this.requestMetadata.get(error.config);
      if (metadata) {
        const duration = (Date.now() - metadata.startTime.getTime()) / 1000;
        const route = new URL(error.config.url!, error.config.baseURL).pathname;

        const status = error.response
          ? error.response.status.toString()
          : "network_error";

        downstreamRequestDurationSeconds
          .labels(serviceName, route)
          .observe(duration);

        downstreamRequestsTotal.labels(serviceName, route, status).inc();

        this.requestMetadata.delete(error.config);
      }
    }

    return Promise.reject(error);
  };
}
