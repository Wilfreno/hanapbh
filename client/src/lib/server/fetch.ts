import { ServerResponse } from "@/lib/types/server-response";

const server_url = process.env.NEXT_PUBLIC_SERVER!;
if (!server_url)
  throw new Error("NEXT_PUBLIC_SERVER is missing from your .env.local file");

function pathChecker(path: string) {
  if (!path.startsWith("/")) throw new Error("path must start with /");
}

async function responseJSON(response: Response): Promise<ServerResponse> {
  try {
    const response_json = (await response.json()) as ServerResponse;

    if (response_json.status !== "OK" && response_json.status !== "CREATED")
      throw new Error(response_json.message);

    return response_json;
  } catch (error) {
    throw error;
  }
}

/**
 *  Sends a POST request to the specified path with the provided body.
 * @param path  The path on which the request is sent. The `server domain` is `unnecessary`.
 * @param body  The body of the http request
 * @returns {Promise<ServerResponse>}  An `object` containing `status`, `message` and, `data`
 * @see {@link ServerResponse}  For the type structure
 * @example
 *  const {status , message, data} = await POSTRequest("/v1/user", { id: 123 })
 */
async function POSTRequest<T>(path: string, body: T): Promise<ServerResponse> {
  try {
    pathChecker(path);

    const response = await fetch(server_url + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return await responseJSON(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Sends a GET request to the specified URL with optional query parameters.
 * @param {string} path  The path on which the request is sent. The `server domain` is `unnecessary`.
 * @param {T} query_params `(optional)` the query parameter of the url represented as an object
 * @returns {Promise<ServerResponse>}  An `object` containing `status`, `message` and, `data`
 * @see {@link ServerResponse} For the type structure
 * @example
 *  const {status , message, data} = await http_request.GET("/v1/user")
 *
 *  const {status , message, data} = await http_request.GET("/v1/user", { id: 123 }) // the path will become /v1/user?id=123
 */
export async function GETRequest<T>(
  path: string,
  query_params?: T
): Promise<ServerResponse> {
  try {
    pathChecker(path);
    let request = path;
    if (query_params)
      request += "?" + new URLSearchParams(query_params).toString();

    const response = await fetch(server_url + request);

    return await responseJSON(response);
  } catch (error) {
    throw error;
  }
}
/**
 *  Sends a PATCH request to the specified path with the provided body.
 * @param {string} path  The path on which the request is sent. The `server domain` is `unnecessary`.
 * @param {T} body  The body of the http request
 * @returns {Promise<ServerResponse>}  An `object` containing `status`, `message` and, `data`
 * @see {@link ServerResponse}  For the type structure
 * @example
 *  const {status , message, data} = await POSTRequest("/v1/user", { id: 123 })
 */
export async function PATCHRequest<T>(
  path: string,
  body: T
): Promise<ServerResponse> {
  try {
    pathChecker(path);

    const response = await fetch(server_url + path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return await responseJSON(response);
  } catch (error) {
    throw error;
  }
}
/**
 *  Sends a DELETE request to the specified path with the provided body.
 * @param {string} path  The path on which the request is sent. The `server domain` is `unnecessary`.
 * @param {T} body  The body of the http request
 * @returns {Promise<ServerResponse>}  An `object` containing `status`, `message` and, `data`
 * @see {@link ServerResponse}  For the type structure
 * @example
 *
 *  const {status , message, data} = await DELETERequest("/v1/user", { id: 123 })
 */
export async function DELETERequest<T>(
  path: string,
  body: T
): Promise<ServerResponse> {
  try {
    pathChecker(path);

    const response = await fetch(server_url + path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return await responseJSON(response);
  } catch (error) {
    throw error;
  }
}
