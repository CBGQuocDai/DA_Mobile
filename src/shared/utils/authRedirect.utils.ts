/** Only destinations used by customer login flows are accepted. */
export function normalizeAuthReturnTo(value: string | string[] | undefined) {
  const target = Array.isArray(value) ? value[0] : value;
  return target === "/favorites" ||
    (target && /^\/book\/[1-9]\d*$/.test(target))
    ? target
    : undefined;
}

export function authReturnRoute(value: string | string[] | undefined) {
  const target = normalizeAuthReturnTo(value);
  if (target === "/favorites")
    return { pathname: "/(tabs)/favorites" } as const;
  if (target)
    return {
      pathname: "/book/[id]",
      params: { id: target.slice("/book/".length) },
    } as const;
  return { pathname: "/(tabs)" } as const;
}
