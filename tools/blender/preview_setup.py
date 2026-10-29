"""Studio preview for the Module01_TV scene: lavender sweep, softboxes, camera. Kept in a
separate "Preview" collection so it never ends up in the export."""
import math

import bpy
from mathutils import Vector

scene = bpy.data.scenes["Module01_TV"]
bpy.context.window.scene = scene

old = bpy.data.collections.get("Preview")
if old:
    for obj in list(old.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(old)
preview = bpy.data.collections.new("Preview")
scene.collection.children.link(preview)


def linear(hex_color):
    h = hex_color.lstrip("#")
    channels = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels)


STUDIO = linear("#b9bccd")

world = bpy.data.worlds.get("M1_Studio") or bpy.data.worlds.new("M1_Studio")
scene.world = world
if not world.node_tree:
    world.use_nodes = True
background = world.node_tree.nodes["Background"]
background.inputs["Color"].default_value = (*STUDIO, 1)
background.inputs["Strength"].default_value = 0.6

floor_mat = bpy.data.materials.get("Preview_Floor") or bpy.data.materials.new("Preview_Floor")
if not floor_mat.node_tree:
    floor_mat.use_nodes = True
floor_bsdf = floor_mat.node_tree.nodes["Principled BSDF"]
floor_bsdf.inputs["Base Color"].default_value = (*STUDIO, 1)
floor_bsdf.inputs["Roughness"].default_value = 0.9

floor_mesh = bpy.data.meshes.new("preview_floor")
floor_mesh.from_pydata([(-20, -20, 0), (20, -20, 0), (20, 20, 0), (-20, 20, 0)], [], [(0, 1, 2, 3)])
floor = bpy.data.objects.new("preview_floor", floor_mesh)
floor_mesh.materials.append(floor_mat)
preview.objects.link(floor)

tv = [o for o in bpy.data.collections["TV"].all_objects if o.type == "MESH"]
floor.location.z = min((o.matrix_world @ Vector(c)).z for o in tv for c in o.bound_box)


def area_light(name, location, size, energy, color=(1, 1, 1)):
    light = bpy.data.lights.new(name, "AREA")
    light.shape = "RECTANGLE"
    light.size, light.size_y = size
    light.energy = energy
    light.color = color
    obj = bpy.data.objects.new(name, light)
    obj.location = location
    direction = Vector((0, 0, 0.1)) - Vector(location)
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    preview.objects.link(obj)


area_light("key_top", (0.6, -2.5, 5.5), (5, 3), 900)
area_light("fill_left", (-5, -3, 1.5), (3, 4), 350)
area_light("rim_right", (5, 2, 2.5), (2, 4), 450)
area_light("front", (0, -6, 0.8), (4, 2), 180)

camera_data = bpy.data.cameras.new("PreviewCam")
camera_data.lens = 70
camera = bpy.data.objects.new("PreviewCam", camera_data)
preview.objects.link(camera)
scene.camera = camera


def aim(position, target=(0, 0, -0.15)):
    camera.location = position
    camera.rotation_euler = (Vector(target) - Vector(position)).to_track_quat("-Z", "Y").to_euler()


aim((2.6, -7.2, 1.6))

scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1000
scene.render.resolution_y = 1000
scene.render.film_transparent = False
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
eevee = scene.eevee
eevee.taa_render_samples = 64
if hasattr(eevee, "use_raytracing"):
    eevee.use_raytracing = True
if hasattr(eevee, "use_shadows"):
    eevee.use_shadows = True

result = {"camera": list(camera.location), "floor_z": floor.location.z}
