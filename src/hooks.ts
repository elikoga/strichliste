import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // host ident authuser date request status bytes
  const request = event.request.clone();
  const response = await resolve(event);
  const myResponse = response.clone();
  const logString = `${event.clientAddress} - - [${new Date().toISOString()}] "${
    event.request.method
  } ${event.request.url}" ${response.status} ${
    (await myResponse.arrayBuffer()).byteLength
  } \`${await request.text()}\``;
  console.log(logString);
  return response;
};
