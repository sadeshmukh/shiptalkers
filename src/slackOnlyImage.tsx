import satori from "satori";
import { readFile, writeFile } from "fs/promises";
import { formatDuration } from "./util";
import { Resvg } from "@resvg/resvg-js";

export interface SlackOnlyData {
  avatarUrl: string;
  displayName: string;
  slackTimeSeconds: number;
}

const regularFontBuffer = await readFile("fonts/Outfit-Regular.ttf");
const boldFontBuffer = await readFile("fonts/Outfit-Bold.ttf");

const WIDTH = 600;
const HEIGHT = 400;

export default async function generateSlackOnlyImage(data: SlackOnlyData) {
  let svg = await satori(
    <div tw="flex flex-col w-full h-full items-center justify-start bg-[#1e1e2e] text-[#cdd6f4] relative">
      <div tw="flex flex-col w-full px-8 py-6 md:items-center justify-between">
        <h2 tw="flex flex-wrap items-center justify-center text-4xl font-bold tracking-tight">
          <img
            src={data.avatarUrl}
            width="64"
            height="64"
            tw="rounded-full mr-3"
          />
          <span tw="mr-2">{data.displayName}'s</span>
          <span tw="text-[#89b4fa] mr-2">time spent on Slack</span>
        </h2>
        <div tw="mt-1 flex md:mt-0 justify-center">
          <div tw="flex flex-col items-center rounded-md shadow bg-[#313244] px-5 py-4">
            <span tw="font-semibold text-lg mb-2">Time spent on Slack</span>
            <span tw="font-black text-3xl">{formatDuration(data.slackTimeSeconds)}</span>
          </div>
        </div>
      </div>
      <span tw="text-[#f9e2af] font-semibold text-xl absolute bottom-5">
        Get yours at #ship-talkers!
      </span>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Outfit",
          data: regularFontBuffer,
          weight: 400,
          style: "normal",
        },
        {
          name: "Outfit",
          data: boldFontBuffer,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  await writeFile("output.svg", svg);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });
  const pngData = await resvg.render();
  const pngBuffer = pngData.asPng();
  return pngBuffer;
}
