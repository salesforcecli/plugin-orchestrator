/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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

  const response = await connection.request<T>({
    method,
    url: apiPath,
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
}
