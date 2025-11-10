import { ImageResponse } from "next/og";

export const contentType = "image/png";

export default function Icon({
  params,
}: {
  params: { business: string };
}): ImageResponse {
  const { business } = params;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "black",
          color: "white",
          display: "flex",
          fontSize: 24,
          height: "100%",
          justifyContent: "center",
          textTransform: "uppercase",
          width: "100%",
        }}
      >
        {business[0]}
      </div>
    ),
    {
      width: 32,
      height: 32,
    },
  );
}
