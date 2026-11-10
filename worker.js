// viseoncrawltest.uk (UAT): the site's files, plus /dq-api/*, passed straight to UAT's Data Assurance API.
//
// Why: the portal signs people in with a cookie the API sets. Called on its own address (execute-api.amazonaws.com)
// that cookie belongs to another site, and Firefox and Safari keep another site's cookies apart from this one's, so
// the sign-in never stuck and the portal looped back to Auth0 until Auth0 refused. Through /dq-api the API answers
// as viseoncrawltest.uk, so the cookie is this site's own and every browser keeps it. (Prod has no need: its API is
// api.vda.viseon.io, the same site as its pages.)
//
// Everything is passed as it is, both ways: method, headers (cookies and keys included), body, status, and redirects
// (Location is returned, never followed), so a sign-in hand-off to Auth0 and back works as before.
const API = 'https://i1jwcc4bx4.execute-api.eu-west-1.amazonaws.com/dev';
const PREFIX = '/dq-api';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === PREFIX || url.pathname.startsWith(PREFIX + '/')) {
      const target = API + url.pathname.slice(PREFIX.length) + url.search;
      const headers = new Headers(request.headers);
      headers.delete('host');
      const hasBody = !['GET', 'HEAD'].includes(request.method);
      const res = await fetch(target, {
        method: request.method, headers, body: hasBody ? request.body : undefined, redirect: 'manual',
      });
      return new Response(res.body, res);
    }
    return env.ASSETS.fetch(request);
  },
};
