export function errMsg(e: any): string {
  // axios-style
  const r = e?.response;
  const d = r?.data;
  return (
    (typeof d === 'string' && d) ||
    d?.message ||
    r?.statusText ||
    e?.message ||
    (typeof e === 'string' ? e : JSON.stringify(e))
  );
}
