import dns from "dns/promises";

function isPrivateIP(ip: string): boolean {
  // IPv6 loopback and unspecified
  if (ip === "::1" || ip === "::") return true;

  // IPv4-mapped IPv6 (e.g., ::ffff:127.0.0.1)
  const v4Mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  const ipv4 = v4Mapped ? v4Mapped[1] : ip;

  const parts = ipv4.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p))) {
    // IPv6 private range (fc00::/7)
    return ip.startsWith("fc") || ip.startsWith("fd");
  }

  const [a, b] = parts;

  return (
    a === 127 ||                        // 127.0.0.0/8
    a === 10 ||                         // 10.0.0.0/8
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
    (a === 192 && b === 168) ||         // 192.168.0.0/16
    (a === 169 && b === 254) ||         // 169.254.0.0/16
    a === 0                             // 0.0.0.0/8
  );
}

export async function validateRSSUrl(
  url: string
): Promise<{ valid: boolean; reason?: string }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, reason: "Invalid URL" };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { valid: false, reason: "Only HTTP/HTTPS protocols allowed" };
  }

  try {
    const { address } = await dns.lookup(parsed.hostname);
    if (isPrivateIP(address)) {
      return { valid: false, reason: "URL resolves to a private IP address" };
    }
  } catch {
    return { valid: false, reason: "Cannot resolve hostname" };
  }

  return { valid: true };
}
