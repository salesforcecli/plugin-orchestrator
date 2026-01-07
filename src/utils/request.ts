/*
 * Copyright 2025, Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Connection } from '@salesforce/core';

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  body?: unknown;
};

/**
 * Make a request to the Salesforce REST API
 *
 * @param connection - Salesforce connection
 * @param options - Request options
 * @returns Response data
 */
export async function request<T>(connection: Connection, options: RequestOptions): Promise<T> {
  const { method, url, body } = options;

  const apiPath = `/services/data/v${connection.getApiVersion()}/app-framework${url}`;

  try {
    const response = await connection.request<T>({
      method,
      url: apiPath,
      body: body ? JSON.stringify(body) : undefined,
    });

    return response;
  } catch (error) {
    // Re-throw with more context about the API call
    const errorMessage = `API request failed: ${method} ${apiPath}`;
    if (error instanceof Error) {
      error.message = `${errorMessage} - ${error.message}`;
    }
    throw error;
  }
}
