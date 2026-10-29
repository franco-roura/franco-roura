"""Bakes ambient occlusion for the TV into one shared atlas (second UV map "AO") and exports
the TV collection as a Draco-compressed GLB plus the AO atlas as WebP, into the site's
public/models folder."""
import math
import os

import bpy
import numpy as np

STAGE = globals().get("STAGE", "all")  # "uv", "bake", "export" or "all"
SAMPLES = globals().get("SAMPLES", 48)
SIZE = 1024
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT_DIR = os.path.join(REPO, "public", "models")

scene = bpy.data.scenes["Module01_TV"]
bpy.context.window.scene = scene
tv = bpy.data.collections["TV"]
meshes = [o for o in tv.all_objects if o.type == "MESH"]
skip = {"screen_glass", "screen_display"}
targets = [o for o in meshes if o.name not in skip]
report = {}


def select_only(objects, active):
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    for obj in scene.objects:
        obj.select_set(False)
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = active


if STAGE in ("uv", "all"):
    for obj in meshes:
        layers = obj.data.uv_layers
        if "UVMap" not in layers:
            layers.new(name="UVMap")
        if "AO" not in layers:
            layers.new(name="AO")
        layers.active = layers["AO"]
    select_only(targets, targets[0])
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.004, area_weight=0.0, correct_aspect=True, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    report["uv"] = "ok"

if STAGE in ("bake", "all"):
    if bpy.data.images.get("tv_ao"):
        bpy.data.images.remove(bpy.data.images["tv_ao"])
    image = bpy.data.images.new("tv_ao", SIZE, SIZE, alpha=False)
    image.generated_color = (1, 1, 1, 1)
    materials = {slot.material for obj in targets for slot in obj.material_slots if slot.material}
    for mat in materials:
        tree = mat.node_tree
        node = tree.nodes.get("AO_Bake") or tree.nodes.new("ShaderNodeTexImage")
        node.name = "AO_Bake"
        node.image = image
        tree.nodes.active = node

    hidden = []
    for obj in scene.objects:
        preview = any(c.name == "Preview" for c in obj.users_collection)
        if (obj.name in skip or preview) and not obj.hide_render:
            obj.hide_render = True
            hidden.append(obj)

    previous_engine = scene.render.engine
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = SAMPLES
    scene.world.light_settings.distance = 0.25
    scene.render.bake.margin = 8
    scene.render.bake.use_clear = True
    scene.render.bake.target = "IMAGE_TEXTURES"
    select_only(targets, targets[0])
    bpy.ops.object.bake(type="AO", margin=8, use_clear=True)

    for obj in hidden:
        obj.hide_render = False
    scene.render.engine = previous_engine

    # Bake noise doesn't compress; two 3x3 box blurs take the WebP from ~630 KB to ~33 KB
    pixels = np.empty(SIZE * SIZE * 4, dtype=np.float32)
    image.pixels.foreach_get(pixels)
    gray = pixels.reshape(SIZE, SIZE, 4)[:, :, 0]
    for _ in range(2):
        padded = np.pad(gray, 1, mode="edge")
        gray = sum(padded[dy : dy + SIZE, dx : dx + SIZE] for dy in range(3) for dx in range(3)) / 9
    image.pixels.foreach_set(np.dstack([gray, gray, gray, np.ones_like(gray)]).astype(np.float32).ravel())

    os.makedirs(OUT_DIR, exist_ok=True)
    image.file_format = "WEBP"
    image.save(filepath=os.path.join(OUT_DIR, "tv-ao.webp"), quality=78, save_copy=True)
    report["bake"] = {"materials": sorted(m.name for m in materials), "samples": SAMPLES}

if STAGE in ("export", "all"):
    select_only(list(tv.all_objects), targets[0])
    path = os.path.join(OUT_DIR, "tv.glb")
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        use_active_scene=True,
        export_apply=True,
        export_yup=True,
        export_texcoords=True,
        export_normals=True,
        export_tangents=False,
        export_materials="EXPORT",
        export_image_format="NONE",
        export_vertex_color="NONE",
        export_cameras=False,
        export_lights=False,
        export_extras=False,
        export_animations=False,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
        export_draco_texcoord_quantization=12,
    )
    for obj in scene.objects:
        obj.select_set(False)
    report["export"] = {"glb_bytes": os.path.getsize(path)}

result = report
