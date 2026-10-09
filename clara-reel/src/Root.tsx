import { Composition } from "remotion";
import { ClaraReel } from "./ClaraReel";
import { ReelV2, V2_SECONDS } from "./v2/ReelV2";
import { ReelV3, V3_SECONDS } from "./v3/ReelV3";
import { FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
