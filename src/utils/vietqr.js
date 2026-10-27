/** Ảnh QR chuyển khoản qua dịch vụ VietQR (bankCode: VCB, TCB, MB, ACB, ...) */
export function vietQrUrl({ bankCode, accountNumber, accountName }) {
  const params = new URLSearchParams({ accountName: accountName || '' });
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?${params}`;
}
