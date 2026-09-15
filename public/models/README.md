# Hero 3D door model — drop folder

## File wanted

`door.glb` — one realistic aluminum sliding door, placed in THIS folder
(`furniture-demo/public/models/door.glb`).

## Model spec (important — read before exporting)

1. **Two SEPARABLE sliding panels.** Left and right shutter must be distinct
   nodes/objects with clear names, e.g. `door_left` and `door_right`.
   Everything else (outer frame, track, sill) can be one merged static mesh.
   → I animate the open/close by sliding these two nodes apart on scroll.
   If the panels are fused into one mesh, I can only show it static.

2. **Default pose = CLOSED.** Panels meeting at the centre when no
   animation is applied.

3. **Y-up, meters, centred at origin.** Door centred on X=0, floor at Y=0.

4. **Lightweight:** under ~4 MB. One 1K–2K texture max, or vertex colors /
   plain PBR materials (preferred). Avoid 4K textures.

5. **Materials:** metallic aluminum frames (metalness ~0.9, roughness ~0.3),
   glass as `transparent` physical material or MSFT transmission — either
   works; tell me which you used.

6. **No embedded animation required.** I drive the slide in code.
   (If your file DOES contain an open/close clip, tell me its exact name
   and I'll play that instead.)

## What happens after you drop it in

- I load it with `useGLTF`, wire panel slide to the pinned hero scroll
  (closed at top → open as you scroll), keep the current stylized door
  as automatic fallback if the file is missing.
- Send/tell me the node names of the two panels if they differ from
  `door_left` / `door_right`.
