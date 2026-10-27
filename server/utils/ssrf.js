import dns from 'dns';
import { promisify } from 'util';
import url from 'url';
import net from 'net';

const lookupAsync = promisify(dns.lookup);

// IP address ranges that must be blocked for SSRF prevention
const BLOCKED_IP_REGEX = [
  /^127\./,                         // Loopback IPv4
  /^0\./,                           // Zero addresses
  /^10\./,                          // RFC 1918 Private (10.0.0.0/8)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // RFC 1918 Private (172.16.0.0/12)
  /^192\.168\./,                    // RFC 1918 Private (192.168.0.0/16)
  /^169\.254\./,                    // Link-local / Cloud Metadata (169.254.0.0/16)
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Shared address space (RFC 6598)
  /^192\.0\.0\./,                   // IETF Protocol Assignments
  /^198\.18\./,                     // Benchmark testing
  /^198\.19\./,                     // Benchmark testing
  /^198\.51\.100\./,                // Documentation
  /^203\.0\.113\./,                 // Documentation
  /^::1$/,                          // Loopback IPv6
  /^fc00:/i,                        // IPv6 Unique local (fc00::/7)
  /^fd[0-9a-f]{2}:/i,               // IPv6 Unique local
  /^fe80:/i,                        // IPv6 Link-local (fe80::/10)
  /^0:0:0:0:0:0:0:1$/,              // IPv6 Loopback full
  /^::ffff:127\./i,                 // IPv4-mapped loopback
  /^::ffff:10\./i,                  // IPv4-mapped private
  /^::ffff:172\.(1[6-9]|2[0-9]|3[0-1])\./i,
  /^::ffff:192\.168\./i,
  /^::ffff:169\.254\./i             // IPv4-mapped link-local / metadata
];

const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  'local',
  'internal',
  'intranet',
  'metadata.google.internal',
  '169.254.169.254',
  'instance-data'
];

/**
 * Validates a target URL to ensure it is not pointing to private or restricted networks.
 * Resolves DNS to ensure host does not resolve to an internal IP address.
 */
export async function validateSafeUrl(targetUrl) {
  let parsed;
  try {
    parsed = new url.URL(targetUrl);
  } catch {
    throw new Error('Invalid URL format. Please provide a valid HTTP or HTTPS URL.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS protocols are permitted for security.');
  }

  const hostname = parsed.hostname.toLowerCase();

  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.some(b => hostname === b || hostname.endsWith(`.${b}`))) {
    throw new Error('Access to local or internal infrastructure addresses is strictly prohibited.');
  }

  // Reject numerical representation bypasses (e.g. integer IP representation: http://2130706433)
  if (/^\d+$/.test(hostname)) {
    throw new Error('Numeric IP addresses are not permitted.');
  }

  // Check raw IP addresses directly in hostname
  if (net.isIP(hostname)) {
    for (const regex of BLOCKED_IP_REGEX) {
      if (regex.test(hostname)) {
        throw new Error('Access to private, loopback, or link-local IP addresses is not permitted.');
      }
    }
    return parsed.toString();
  }

  // Resolve DNS to verify the target IP isn't resolving to a private/loopback IP
  try {
    const addresses = await lookupAsync(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      throw new Error(`Unable to resolve domain "${hostname}".`);
    }

    for (const addr of addresses) {
      for (const regex of BLOCKED_IP_REGEX) {
        if (regex.test(addr.address)) {
          throw new Error('The domain resolves to a restricted internal or private IP address.');
        }
      }
    }
  } catch (err) {
    if (err.message && err.message.includes('restricted internal')) throw err;
    throw new Error(`Unable to resolve domain "${hostname}". Please verify that the domain exists.`);
  }

  return parsed.toString();
}

/**
 * Performs a safe HTTP fetch following up to maxRedirects redirects,
 * validating EVERY redirect destination with validateSafeUrl before fetching.
 */
export async function fetchWithSafeRedirects(initialUrl, fetchOptions = {}, maxRedirects = 3) {
  let currentUrl = await validateSafeUrl(initialUrl);
  let redirectCount = 0;

  while (redirectCount <= maxRedirects) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetchOptions.timeoutMs || 7000);

    const mergedOptions = {
      ...fetchOptions,
      signal: controller.signal,
      redirect: 'manual' // Handle redirects manually to revalidate destination
    };

    let response;
    try {
      response = await fetch(currentUrl, mergedOptions);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Request timed out after 7 seconds. The portfolio server was too slow to respond.');
      }
      throw err;
    }
    clearTimeout(timeoutId);

    // Check for HTTP redirects (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) {
        return response;
      }

      redirectCount++;
      if (redirectCount > maxRedirects) {
        throw new Error('Too many redirects encountered while fetching the portfolio URL.');
      }

      // Resolve relative redirect against current URL
      const resolvedRedirect = new url.URL(location, currentUrl).toString();

      // Revalidate the new redirect destination against SSRF rules!
      currentUrl = await validateSafeUrl(resolvedRedirect);
      continue;
    }

    return response;
  }

  throw new Error('Failed to retrieve portfolio URL.');
}
