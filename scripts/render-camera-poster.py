"""Render the live Three.js model as a static fallback. No product photography is fabricated."""
import bpy
import json
import math
import sys
from mathutils import Vector

source, output = sys.argv[sys.argv.index('--') + 1:]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for index, item in enumerate(json.load(open(source))):
    mesh = bpy.data.meshes.new('camera-part')
    mesh.from_pydata(item['vertices'], [], item['faces'])
    mesh.update()
    obj = bpy.data.objects.new('part-' + str(index), mesh)
    bpy.context.collection.objects.link(obj)
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    mat = bpy.data.materials.new('surface')
    mat.diffuse_color = (*item['color'], 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*item['color'], 1)
    shader.inputs['Metallic'].default_value = item.get('metalness') or 0
    shader.inputs['Roughness'].default_value = item.get('roughness') or .08
    shader.inputs['Transmission Weight'].default_value = item['transmission']
    shader.inputs['IOR'].default_value = 1.52
    mesh.materials.append(mat)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 96
scene.cycles.use_denoising = False
scene.world.color = (.28, .28, .28)

def area(name, position, energy, size, color):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = position
    obj.rotation_euler = (Vector((0, 0, .5)) - obj.location).to_track_quat('-Z', 'Y').to_euler()

area('key', (-4, -4, 6), 850, 5, (1, .94, .86))
area('rim', (5, 1, 4), 1100, 4, (.82, .91, 1))
area('fill', (1, -6, 1.5), 250, 3, (1, 1, 1))
bpy.ops.object.camera_add(location=(0, -11.5, .35))
camera = bpy.context.object
camera.rotation_euler = (Vector((0, 0, .15)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera.data.sensor_fit = 'VERTICAL'
camera.data.angle = math.radians(32)
scene.camera = camera
scene.render.resolution_x = 1440
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.filepath = output
scene.view_settings.view_transform = 'AgX'
bpy.ops.render.render(write_still=True)
