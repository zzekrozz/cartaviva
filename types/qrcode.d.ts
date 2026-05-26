declare module "qrcode" {
  export type QRCodeToDataURLOptions = {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    color?: {
      dark?: string;
      light?: string;
    };
  };

  const QRCode: {
    toDataURL(value: string, options?: QRCodeToDataURLOptions): Promise<string>;
  };

  export default QRCode;
}
