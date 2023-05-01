// this was mostly copied from https://plausible.io/docs/proxy/guides/cloudflare 
const ScriptName = '/datahelper/helper.js';
const Endpoint = '/datahelper/event';

const ScriptWithoutExtension = ScriptName.replace('.js', '')


export async function onRequest(event) {
  const pathname = new URL(event.request.url).pathname
  const [baseUri, ...extensions] = pathname.split('.')

  if (baseUri.endsWith(ScriptWithoutExtension)) {
      return getScript(event, extensions)
  } else if (pathname.endsWith(Endpoint)) {
      return postData(event)
  }
  return new Response(null, { status: 404 })
}

async function getScript(event, extensions) {
    let response = await caches.default.match(event.request);
    if (!response) {
        response = await fetch("https://plausible.mdics.me/js/plausible." + extensions.join("."));
        event.waitUntil(caches.default.put(event.request, response.clone()));
    }
    return response;
}

async function postData(event) {
    const request = new Request(event.request);
    request.headers.delete('cookie');
    return await fetch("https://plausible.mdics.me/api/event", request);
}