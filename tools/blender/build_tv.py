"""Builds the Module/01 TV in its own scene (Module01_TV). Blender is Z-up, the TV faces -Y.

Parts are grouped under empties named after the site's explode parts (shell, screen, trim,
base, io) so the glTF keeps that structure. Run again to rebuild from scratch.
"""
import math
import os

import bmesh
import bpy
from mathutils import Matrix, Vector

SCENE_NAME = "Module01_TV"
# Run with __file__ set (see tools/blender/README.md) so paths resolve from the repo root
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
AVATAR = os.path.join(REPO, "public", "avatar.webp")

# Body
W, H, D = 2.1, 1.6, 0.9
FRONT = -D / 2
NOTCH = 0.38
SEAM_Z, SEAM_GAP = -0.6, 0.024
REAR_Y = 0.16  # front shell / rear cover split
TOP_VENT = dict(x=-0.45, y=-0.12, w=0.5, h=0.32, r=0.08, depth=0.045)

# Screen bay and console, on the front face
BAY = dict(x=-0.2, z=0.06, w=1.44, h=1.12, r=0.16, depth=0.1)
SCREEN_W, SCREEN_H = 1.3, 1.0
CONSOLE = dict(x=0.76, z=0.0, w=0.28, h=1.0, r=0.1, depth=0.07)


# ---------- helpers ----------

def linear(hex_color, alpha=1.0):
    h = hex_color.lstrip("#")
    channels = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels) + (alpha,)


def rounded_polygon(corners, radii, segments=10):
    """Corners in order (counter-clockwise), each rounded with a quadratic Bezier of the given radius."""
    points = []
    count = len(corners)
    for index, corner in enumerate(corners):
        corner = Vector(corner)
        prev_pt = Vector(corners[index - 1])
        next_pt = Vector(corners[(index + 1) % count])
        radius = radii[index]
        if radius <= 0:
            points.append(corner)
            continue
        start = corner + (prev_pt - corner).normalized() * radius
        end = corner + (next_pt - corner).normalized() * radius
        for step in range(segments + 1):
            t = step / segments
            points.append((1 - t) ** 2 * start + 2 * (1 - t) * t * corner + t ** 2 * end)
    return [(p.x, p.y) for p in points]


def rect_corners(cx, cz, w, h):
    return [(cx - w / 2, cz - h / 2), (cx + w / 2, cz - h / 2), (cx + w / 2, cz + h / 2), (cx - w / 2, cz + h / 2)]


def rounded_rect(cx, cz, w, h, r, segments=10):
    return rounded_polygon(rect_corners(cx, cz, w, h), [r] * 4, segments)


def prism_mesh(name, poly, y0, y1, bevel=0.0, bevel_segments=5, profile=0.5):
    """Extrude a polygon given in the XZ plane from y0 to y1, rounding both caps' rims."""
    bm = bmesh.new()
    verts = [bm.verts.new((x, y0, z)) for x, z in poly]
    face = bm.faces.new(verts)
    extruded = bmesh.ops.extrude_face_region(bm, geom=[face])
    moved = [g for g in extruded["geom"] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, y1 - y0, 0), verts=moved)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if bevel > 0:
        bm.normal_update()
        cap_edges = [e for e in bm.edges if any(abs(f.normal.y) > 0.99 for f in e.link_faces)]
        bmesh.ops.bevel(
            bm, geom=cap_edges, offset=bevel, offset_type="OFFSET", segments=bevel_segments,
            profile=profile, affect="EDGES", clamp_overlap=True,
        )
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    return mesh


def cylinder_mesh(name, radius, z0, z1, bevel=0.0, bevel_segments=4, vertices=64):
    poly = [(radius * math.cos(2 * math.pi * i / vertices), radius * math.sin(2 * math.pi * i / vertices)) for i in range(vertices)]
    mesh = prism_mesh(name, poly, z0, z1, bevel, bevel_segments)
    # prism_mesh extrudes along Y; turn it to stand along Z
    mesh.transform(Matrix.Rotation(math.radians(90), 4, "X"))
    return mesh


def add_object(name, mesh, parent, material, collection):
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.parent = parent
    if material:
        mesh.materials.append(material)
    return obj


def apply_modifiers(obj):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(depsgraph)
    mesh = bpy.data.meshes.new_from_object(evaluated, preserve_all_data_layers=True, depsgraph=depsgraph)
    old = obj.data
    obj.modifiers.clear()
    obj.data = mesh
    mesh.name = old.name
    bpy.data.meshes.remove(old)


def cut(obj, cutter_mesh, collection, rim_bevel=0.0):
    """Boolean-difference a cutter out of obj, then soften the new rim. Keeps one material slot."""
    keep = obj.data.materials[0] if len(obj.data.materials) else None
    cutter = bpy.data.objects.new(obj.name + "_cutter", cutter_mesh)
    collection.objects.link(cutter)
    cutter.matrix_world = obj.matrix_world.copy()
    boolean = obj.modifiers.new("cut", "BOOLEAN")
    boolean.operation = "DIFFERENCE"
    boolean.solver = "EXACT"
    boolean.object = cutter
    bpy.context.view_layer.update()
    apply_modifiers(obj)
    bpy.data.objects.remove(cutter, do_unlink=True)
    bpy.data.meshes.remove(cutter_mesh)
    if rim_bevel > 0:
        bevel = obj.modifiers.new("rim", "BEVEL")
        bevel.limit_method = "ANGLE"
        bevel.angle_limit = math.radians(40)
        bevel.width = rim_bevel
        bevel.segments = 3
        bevel.harden_normals = False
        apply_modifiers(obj)
    # The exact solver adds the cutter's (empty) slot for the new faces; fold everything back into one slot
    obj.data.materials.clear()
    for polygon in obj.data.polygons:
        polygon.material_index = 0
    if keep:
        obj.data.materials.append(keep)


def bisect_keep(mesh, z, keep_above, axis=2):
    bm = bmesh.new()
    bm.from_mesh(mesh)
    result = bmesh.ops.bisect_plane(
        bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:],
        plane_co=tuple(z if i == axis else 0 for i in range(3)), plane_no=tuple(1 if i == axis else 0 for i in range(3)),
        clear_inner=keep_above, clear_outer=not keep_above,
    )
    cut_edges = [g for g in result["geom_cut"] if isinstance(g, bmesh.types.BMEdge)]
    bmesh.ops.holes_fill(bm, edges=cut_edges, sides=0)
    bm.to_mesh(mesh)
    bm.free()


def smooth(obj, angle=35):
    mesh = obj.data
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    mesh.set_sharp_from_angle(angle=math.radians(angle))


def material(name, color, roughness, coat=0.0, metallic=0.0, emission=None, alpha=1.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    if not mat.node_tree:
        mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = linear(color)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Coat Weight"].default_value = coat
    bsdf.inputs["Coat Roughness"].default_value = 0.06
    if emission:
        bsdf.inputs["Emission Color"].default_value = linear(emission)
        bsdf.inputs["Emission Strength"].default_value = 2.0
    bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 1:
        mat.surface_render_method = "BLENDED"
    return mat


# ---------- scene ----------

scene = bpy.data.scenes.get(SCENE_NAME) or bpy.data.scenes.new(SCENE_NAME)
bpy.context.window.scene = scene
for obj in list(scene.collection.all_objects):
    data = obj.data
    bpy.data.objects.remove(obj, do_unlink=True)
    if isinstance(data, bpy.types.Mesh) and data.users == 0:
        bpy.data.meshes.remove(data)
for child in list(scene.collection.children):
    bpy.data.collections.remove(child)

tv_collection = bpy.data.collections.new("TV")
scene.collection.children.link(tv_collection)

M = {
    "shell": material("M1_Shell", "#ffffff", 0.32, coat=1.0),
    "satin": material("M1_Satin", "#a9aeb7", 0.48),
    "charcoal": material("M1_Charcoal", "#2a2d31", 0.4),
    "signal": material("M1_Signal", "#ff5f1f", 0.32, coat=0.7),
    "rubber": material("M1_Rubber", "#1c1e21", 0.85),
    "metal": material("M1_Metal", "#9aa0a8", 0.25, metallic=1.0),
    "led": material("M1_LED", "#1fa45a", 0.3, emission="#1fa45a"),
    "glass": material("M1_Glass", "#ffffff", 0.04, coat=1.0, alpha=0.06),
}

screen_mat = bpy.data.materials.get("M1_Screen") or bpy.data.materials.new("M1_Screen")
if not screen_mat.node_tree:
    screen_mat.use_nodes = True
nodes = screen_mat.node_tree.nodes
bsdf = nodes.get("Principled BSDF")
image_node = nodes.get("Avatar") or nodes.new("ShaderNodeTexImage")
image_node.name = "Avatar"
image_node.image = bpy.data.images.load(AVATAR, check_existing=True)
screen_mat.node_tree.links.new(image_node.outputs["Color"], bsdf.inputs["Emission Color"])
bsdf.inputs["Base Color"].default_value = (0.02, 0.02, 0.02, 1)
bsdf.inputs["Emission Strength"].default_value = 1.0
bsdf.inputs["Roughness"].default_value = 0.4
M["screen"] = screen_mat

groups = {}
for part in ("shell", "screen", "trim", "base", "io"):
    empty = bpy.data.objects.new(part, None)
    empty.empty_display_size = 0.2
    tv_collection.objects.link(empty)
    groups[part] = empty

# ---------- X-01 shell: white upper housing + grey chassis, split by a seam ----------

top_right_notch = rounded_polygon(
    [(-W / 2, -H / 2), (W / 2, -H / 2), (W / 2, H / 2 - NOTCH), (W / 2 - NOTCH, H / 2), (-W / 2, H / 2)],
    [0.32, 0.32, 0.07, 0.07, 0.32],
    segments=12,
)
body_mesh = prism_mesh("body", top_right_notch, FRONT, -FRONT, bevel=0.11, bevel_segments=7, profile=0.55)
body = add_object("shell_body", body_mesh, groups["shell"], None, tv_collection)

bay_cutter = prism_mesh("bay_cut", rounded_rect(BAY["x"], BAY["z"], BAY["w"], BAY["h"], BAY["r"]), FRONT - 0.2, FRONT + BAY["depth"])
cut(body, bay_cutter, tv_collection, rim_bevel=0.016)
console_cutter = prism_mesh("console_cut", rounded_rect(CONSOLE["x"], CONSOLE["z"], CONSOLE["w"], CONSOLE["h"], CONSOLE["r"]), FRONT - 0.2, FRONT + CONSOLE["depth"])
cut(body, console_cutter, tv_collection, rim_bevel=0.012)

vent_poly = [(x, -y) for x, y in rounded_rect(TOP_VENT["x"], TOP_VENT["y"], TOP_VENT["w"], TOP_VENT["h"], TOP_VENT["r"])]
vent_cutter = prism_mesh("top_vent_cut", vent_poly, H / 2 - TOP_VENT["depth"], H / 2 + 0.2)
vent_cutter.transform(Matrix.Rotation(math.radians(90), 4, "X"))
cut(body, vent_cutter, tv_collection, rim_bevel=0.012)

lower_mesh = body.data.copy()
lower_mesh.name = "chassis"
bisect_keep(body.data, SEAM_Z + SEAM_GAP / 2, keep_above=True)
bisect_keep(lower_mesh, SEAM_Z - SEAM_GAP / 2, keep_above=False)
lower_mesh.transform(Matrix.Diagonal((0.992, 0.985, 1.0, 1.0)))
rear_mesh = body.data.copy()
rear_mesh.name = "rear"
bisect_keep(body.data, REAR_Y - SEAM_GAP / 2, keep_above=False, axis=1)
bisect_keep(rear_mesh, REAR_Y + SEAM_GAP / 2, keep_above=True, axis=1)
body.name = "shell_upper"
body.data.materials.append(M["shell"])
smooth(body)
rear = add_object("shell_rear", rear_mesh, groups["shell"], M["satin"], tv_collection)
smooth(rear)
chassis = add_object("shell_chassis", lower_mesh, groups["shell"], M["satin"], tv_collection)
smooth(chassis)

badge = add_object(
    "shell_badge",
    prism_mesh("badge", rounded_polygon(
        [(-0.17, -0.025), (0.17, -0.025), (0.17, 0.008), (0.137, 0.025), (-0.17, 0.025)], [0.02, 0.02, 0.008, 0.008, 0.02], 6),
        FRONT - 0.008, FRONT + 0.01, bevel=0.004, bevel_segments=2),
    groups["shell"], M["charcoal"], tv_collection,
)
badge.location = (BAY["x"], 0, (BAY["z"] - BAY["h"] / 2 + SEAM_Z) / 2)
smooth(badge)

# ---------- X-02 screen: charcoal frame, display, slightly bulged glass ----------

frame_mesh = prism_mesh(
    "frame", rounded_rect(BAY["x"], BAY["z"], BAY["w"] - 0.03, BAY["h"] - 0.03, BAY["r"] - 0.015),
    FRONT + 0.025, FRONT + BAY["depth"], bevel=0.012, bevel_segments=3,
)
frame = add_object("screen_frame", frame_mesh, groups["screen"], M["charcoal"], tv_collection)
opening = prism_mesh("opening", rounded_rect(BAY["x"], BAY["z"], SCREEN_W + 0.03, SCREEN_H + 0.03, 0.1), FRONT, FRONT + 0.06)
cut(frame, opening, tv_collection, rim_bevel=0.008)
smooth(frame)

bm = bmesh.new()
panel_poly = rounded_rect(BAY["x"], BAY["z"], SCREEN_W, SCREEN_H, 0.06)
face = bm.faces.new([bm.verts.new((x, FRONT + 0.05, z)) for x, z in panel_poly])
uv_layer = bm.loops.layers.uv.new("UVMap")
for loop in face.loops:
    loop[uv_layer].uv = ((loop.vert.co.x - BAY["x"]) / SCREEN_W + 0.5, (loop.vert.co.z - BAY["z"]) / SCREEN_H + 0.5)
panel_mesh = bpy.data.meshes.new("display")
bm.to_mesh(panel_mesh)
bm.free()
add_object("screen_display", panel_mesh, groups["screen"], M["screen"], tv_collection)

glass_w, glass_h, cols, rows = SCREEN_W + 0.03, SCREEN_H + 0.03, 20, 16
bm = bmesh.new()
grid = []
for j in range(rows + 1):
    row = []
    for i in range(cols + 1):
        u, v = i / cols * 2 - 1, j / rows * 2 - 1
        bulge = 0.014 * (1 - u * u) * (1 - v * v)
        row.append(bm.verts.new((BAY["x"] + u * glass_w / 2, FRONT + 0.04 - bulge, BAY["z"] + v * glass_h / 2)))
    grid.append(row)
for j in range(rows):
    for i in range(cols):
        bm.faces.new((grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]))
glass_mesh = bpy.data.meshes.new("glass")
bm.to_mesh(glass_mesh)
bm.free()
glass = add_object("screen_glass", glass_mesh, groups["screen"], M["glass"], tv_collection)
smooth(glass, 80)

# ---------- X-03 trim: orange side pods + antenna ----------

for side in (-1, 1):
    pod_profile = rounded_rect(0.02, -0.1, 0.8, 0.95, 0.24)  # in YZ: (y, z)
    pod = prism_mesh("pod", pod_profile, -0.08, 0.08, bevel=0.075, bevel_segments=8, profile=0.62)
    # built with its thickness along Y; turn it so the thickness runs along X
    pod.transform(Matrix.Rotation(math.radians(90), 4, "Z"))
    pod_obj = add_object("trim_pod_" + ("left" if side < 0 else "right"), pod, groups["trim"], M["signal"], tv_collection)
    pod_obj.location = (side * (W / 2 + 0.1), 0, 0)
    smooth(pod_obj)
    gasket = prism_mesh("gasket", rounded_rect(0.02, -0.1, 0.7, 0.85, 0.2), -0.03, 0.03, bevel=0.01, bevel_segments=2)
    gasket.transform(Matrix.Rotation(math.radians(90), 4, "Z"))
    gasket_obj = add_object("trim_gasket_" + ("left" if side < 0 else "right"), gasket, groups["trim"], M["charcoal"], tv_collection)
    gasket_obj.location = (side * (W / 2 + 0.01), 0, 0)
    smooth(gasket_obj)

boss = add_object("trim_antenna_base", cylinder_mesh("boss", 0.075, 0, 0.07, bevel=0.02, bevel_segments=3, vertices=48), groups["trim"], M["satin"], tv_collection)
boss.location = (0.32, 0.0, H / 2 - 0.01)
smooth(boss)
rod = add_object("trim_antenna_rod", cylinder_mesh("rod", 0.013, 0, 0.72, vertices=16), groups["trim"], M["metal"], tv_collection)
rod.location = (0.32, 0.0, H / 2 + 0.04)
rod.rotation_euler = (0, math.radians(22), 0)
smooth(rod, 60)
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.05)
tip = bpy.context.active_object
tip.name = "trim_antenna_tip"
for coll in tip.users_collection:
    coll.objects.unlink(tip)
tv_collection.objects.link(tip)
tip.parent = groups["trim"]
tip.data.materials.append(M["signal"])
tip.location = (0.32 + 0.72 * math.sin(math.radians(22)) + 0.02, 0.0, H / 2 + 0.04 + 0.72 * math.cos(math.radians(22)))
smooth(tip, 80)

# ---------- X-04 base: grey neck, rounded white foot, rubber ring ----------

neck = add_object("base_neck", cylinder_mesh("neck", 0.14, -H / 2 - 0.3, -H / 2 + 0.02, bevel=0.03, bevel_segments=4), groups["base"], M["satin"], tv_collection)
smooth(neck)
foot = add_object("base_foot", cylinder_mesh("foot", 0.6, -H / 2 - 0.38, -H / 2 - 0.28, bevel=0.045, bevel_segments=6), groups["base"], M["shell"], tv_collection)
smooth(foot)
ring = add_object("base_ring", cylinder_mesh("ring", 0.54, -H / 2 - 0.4, -H / 2 - 0.375, bevel=0.008, bevel_segments=2), groups["base"], M["rubber"], tv_collection)
smooth(ring)

# ---------- X-05 io: console plate, knob, buttons, LED, vents ----------

plate_mesh = prism_mesh(
    "console", rounded_rect(CONSOLE["x"], CONSOLE["z"], CONSOLE["w"] - 0.024, CONSOLE["h"] - 0.024, CONSOLE["r"] - 0.012),
    FRONT + 0.012, FRONT + CONSOLE["depth"], bevel=0.01, bevel_segments=3,
)
plate = add_object("io_console", plate_mesh, groups["io"], M["charcoal"], tv_collection)
for index in range(4):
    vent = prism_mesh("vent", rounded_rect(CONSOLE["x"], -0.33 - index * 0.055, 0.16, 0.022, 0.0105, 6), FRONT, FRONT + 0.03)
    cut(plate, vent, tv_collection)
smooth(plate)

knob_mesh = cylinder_mesh("knob", 0.095, 0, 0.075, bevel=0.022, bevel_segments=4)
knob_mesh.transform(Matrix.Rotation(math.radians(90), 4, "X"))
knob = add_object("io_knob", knob_mesh, groups["io"], M["signal"], tv_collection)
knob.location = (CONSOLE["x"], FRONT + 0.012, 0.3)
smooth(knob)
marker = add_object("io_knob_marker", prism_mesh("marker", rounded_rect(0, 0, 0.014, 0.06, 0.0065, 4), -0.004, 0.004), groups["io"], M["charcoal"], tv_collection)
marker.location = (CONSOLE["x"], FRONT + 0.012 - 0.075, 0.345)

for index, z in enumerate((0.06, -0.06)):
    button = add_object(
        f"io_button_{index + 1}",
        prism_mesh("button", rounded_rect(0, 0, 0.13, 0.055, 0.027, 8), -0.022, 0.02, bevel=0.012, bevel_segments=3),
        groups["io"], M["satin"], tv_collection,
    )
    button.location = (CONSOLE["x"], FRONT + 0.012, z)
    smooth(button)

bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=0.022)
led = bpy.context.active_object
led.name = "io_led"
for coll in led.users_collection:
    coll.objects.unlink(led)
tv_collection.objects.link(led)
led.parent = groups["io"]
led.data.materials.append(M["led"])
led.location = (CONSOLE["x"], FRONT + 0.012, -0.19)
smooth(led, 80)

grille_poly = [(x, -y) for x, y in rounded_rect(TOP_VENT["x"], TOP_VENT["y"], TOP_VENT["w"] - 0.024, TOP_VENT["h"] - 0.024, TOP_VENT["r"] - 0.012)]
grille_mesh = prism_mesh("grille", grille_poly, H / 2 - TOP_VENT["depth"], H / 2 - 0.012, bevel=0.008, bevel_segments=2)
grille_mesh.transform(Matrix.Rotation(math.radians(90), 4, "X"))
grille = add_object("io_top_grille", grille_mesh, groups["io"], M["charcoal"], tv_collection)
for index in range(5):
    slot_y = TOP_VENT["y"] - 0.1 + index * 0.05
    slot_poly = [(x, -y) for x, y in rounded_rect(TOP_VENT["x"], slot_y, TOP_VENT["w"] - 0.12, 0.022, 0.0105, 6)]
    slot = prism_mesh("slot", slot_poly, H / 2 - 0.03, H / 2 + 0.1)
    slot.transform(Matrix.Rotation(math.radians(90), 4, "X"))
    cut(grille, slot, tv_collection)
smooth(grille)

for obj in tv_collection.objects:
    obj.select_set(False)

triangles = 0
for obj in tv_collection.objects:
    if obj.type == "MESH":
        obj.data.calc_loop_triangles()
        triangles += len(obj.data.loop_triangles)

result = {
    "objects": sorted(o.name for o in tv_collection.objects),
    "triangles": triangles,
}
