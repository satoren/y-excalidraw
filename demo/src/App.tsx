import * as React from "react";

import { Excalidraw } from "@excalidraw/excalidraw";
import * as Y from "yjs";

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawBinding } from "../../src"

import { WebrtcProvider } from 'y-webrtc'

import * as random from 'lib0/random'
import { SIGNALLING_SERVER } from "./constants";

export const usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' }
]

export const userColor = usercolors[random.uint32() % usercolors.length]

const ydoc = new Y.Doc()
const yElements = ydoc.getArray<Y.Map<any>>('elements');
const yAssets = ydoc.getMap('assets');

const provider = new WebrtcProvider('y-excalidraw-demo-room', ydoc, { signaling: [SIGNALLING_SERVER] })

provider.awareness.setLocalStateField('user', {
  name: 'Anonymous ' + Math.floor(Math.random() * 100),
  color: userColor.color,
  colorLight: userColor.light
})

export default function App() {
  const [api, setApi] = React.useState<ExcalidrawImperativeAPI | null>(null);
  const [binding, setBindings] = React.useState<ExcalidrawBinding | null>(null);
  const excalidrawRef = React.useRef(null);

  React.useEffect(() => {
    if (!api) return;

    const binding = new ExcalidrawBinding(
      yElements,
      yAssets,
      excalidrawRef.current,
      api,
      provider.awareness,
    );
    setBindings(binding);

    return () => {
      setBindings(null);
      binding.destroy();
    };
  }, [api]);

  return (
    <div style={{width: "100vw", height: "100vh"}} ref={excalidrawRef}>
      <Excalidraw
        excalidrawAPI={setApi}
        onPointerUpdate={binding?.onPointerUpdate}
        theme="light"
      />
    </div>
  );
}

