import { Composition } from "remotion";
import { ClaraReel } from "./ClaraReel";
import { ReelV2, V2_SECONDS } from "./v2/ReelV2";
import { ReelV3, V3_SECONDS } from "./v3/ReelV3";
import { ReelV4, V4_SECONDS } from "./v4/ReelV4";
import { ReelV5, V5_SECONDS } from "./v5/ReelV5";
import { FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClaraBabyRylan"
        component={ReelV5}
        durationInFrames={Math.round(V5_SECONDS * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="ClaraWhoChildObesity"
        component={ReelV4}
        durationInFrames={Math.round(V4_SECONDS * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="ClaraTavapadon"
        component={ReelV3}
        durationInFrames={Math.round(V3_SECONDS * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="ClaraOptogeneticsV2"
        component={ReelV2}
        durationInFrames={Math.round(V2_SECONDS * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="ClaraOptogenetics"
        component={ClaraReel}
        durationInFrames={Math.round(114.3 * FPS)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ narration: "audio/clara_narration_ep2.mp3" }}
      />
    </>
  );
};
