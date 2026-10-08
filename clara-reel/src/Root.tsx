import { Composition } from "remotion";
import { ClaraReel } from "./ClaraReel";
import { FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ClaraOptogenetics"
      component={ClaraReel}
      durationInFrames={Math.round(114.3 * FPS)}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ narration: "audio/clara_narration_ep2.mp3" }}
    />
  );
};
