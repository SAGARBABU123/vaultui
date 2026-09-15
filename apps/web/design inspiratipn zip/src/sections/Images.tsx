import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Images({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Working with Images
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Ensure text overlaying images remains readable and handle unpredictable user-uploaded content gracefully.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Text needs consistent contrast"
        why="Photos are dynamic with light and dark areas. White text gets lost in the light areas, and dark text gets lost in the dark areas."
        doText="Add a semi-transparent dark overlay, lower the image contrast, or colorize the image (lower contrast + desaturate + multiply blend mode) to make text readable."
        dontText="Do not slap a white headline directly on an unmodified hero image."
        check="Can I easily read this text across all areas of the background image?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Background Image Contrast"
        badLabel="Raw Image"
        goodLabel="With Dark Overlay"
        bad={
          <div className="relative w-full h-48 bg-neutral-300 rounded overflow-hidden flex items-center justify-center">
            {/* Simulated busy background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-neutral-400 to-white opacity-80" />
            <h3 className="relative text-white text-2xl font-bold text-center px-4">
              Meeting Room Scheduling Made Easy
            </h3>
          </div>
        }
        good={
          <div className="relative w-full h-48 bg-neutral-300 rounded overflow-hidden flex items-center justify-center">
            {/* Simulated busy background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-neutral-400 to-white opacity-80" />
            {/* The Overlay */}
            <div className="absolute inset-0 bg-neutral-900/60" />
            <h3 className="relative text-white text-2xl font-bold text-center px-4 drop-shadow-md">
              Meeting Room Scheduling Made Easy
            </h3>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Beware user-uploaded content"
        why="User-uploaded images come in all shapes, sizes, and aspect ratios. Allowing them to display at their intrinsic ratio will break your layout."
        doText="Force images into fixed aspect ratio containers using object-fit: cover or background-size: cover."
        dontText="Do not let a user's tall vertical photo push the rest of your UI down the page."
        check="If a user uploads a weirdly shaped image, is my layout still intact?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Prevent background bleed"
        why="If a user uploads an image with a white background on a white UI, the image loses its shape and bleeds into the canvas."
        doText="Use a subtle inner box-shadow or a faint border that matches the background color to define the image boundary without clashing."
        dontText="Do not leave user avatars floating shapelessly if they have white backgrounds."
        check="Does this image still have a defined shape even if its background matches the page?"
      />

    </div>
  );
}
