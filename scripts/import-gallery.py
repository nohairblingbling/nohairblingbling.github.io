"""Build the approved KOL collections: python3 scripts/import-gallery.py /path/to/KOL.

Requires Pillow with WebP support. Source files are never modified. The generated
manifest and display assets are committed so normal site builds need no importer.
"""
import argparse
import io
import json
import re
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
args = parser.parse_args()
project = Path(__file__).resolve().parents[1]
output = project / 'src/assets/gallery/collections'
output.mkdir(parents=True, exist_ok=True)

collections = {
    'northXinjiangPortraits': ('人像-2025_8_9_北疆', [
        ('ZYD07935.jpg', 'Portrait overlooking a green mountain valley in North Xinjiang'),
        ('ZYD07967.jpg', 'Portrait beside a motorcycle above a mountain valley'),
        ('ZYD08128.jpg', 'Portrait beneath a tree in a sunlit meadow'),
        ('ZYD08153.jpg', 'Portrait beneath branches beside a mountain lake'),
        ('ZYD08173.jpg', 'Portrait at a forest-lined lake'),
        ('ZYD08194_(2).jpg', 'Portrait looking across a lake toward the forest'),
        ('ZYD08293.jpg', 'Lakeside portrait with wooded hills in the background'),
        ('ZYD08342.jpg', 'Portrait among trees beside a forest lake'),
        ('ZYD08344.jpg', 'Portrait in dappled light beside a tree'),
        ('ZYD08413.jpg', 'Portrait under leafy branches beside the water'),
    ]),
    'northwestPortraits': ('人像-2025_8_2_西北', [
        ('ZYD07195.jpg', 'Portrait at a salt lake with bands of orange and blue water'),
        ('ZYD07197.jpg', 'Portrait in a black dress beside a colorful salt lake'),
        ('ZYD07206.jpg', 'Side profile at the edge of a colorful salt lake'),
        ('ZYD07293.jpg', 'Environmental portrait on a salt lake shore beneath distant mountains'),
        ('ZYD07500.jpg', 'Portrait in black among pale desert dunes'),
        ('ZYD07532.jpg', 'Portrait against layered desert dunes'),
        ('ZYD07545.jpg', 'Portrait with pale dunes and dark mountains in the background'),
        ('DJI_20250805180531_0238_D.jpg', 'Aerial view of a lone figure amid sweeping desert dunes'),
        ('ZYD07594_(2).jpg', 'Portrait in white beside an earthen building'),
        ('ZYD07727_(2).jpg', 'Portrait in warm evening light on a sand dune'),
        ('ZYD07732.jpg', 'Portrait among golden dunes with an arm raised'),
        ('ZYD07739_(2).jpg', 'Side profile against soft golden sand dunes'),
        ('ZYD07756.jpg', 'Portrait in a flowing dress in the desert'),
    ]),
    'yunnan': ('2025_3_22_云南', [
        ('IMG_0014 1.jpg', 'Pink blossoms reflected in water in Yunnan'),
        ('ZYD04784.jpg', 'A lakeshore framed by leafy trees in Yunnan'),
        ('ZYD04811.jpg', 'Bare branches rising from a blue lake'),
        ('ZYD04939 2.jpg', 'A quiet interior framing a sunlit doorway'),
        ('ZYD05137.jpg', 'Snow-covered mountains reflected in still water'),
    ]),
}


def convert(job):
    collection, folder, filename, alt = job
    source = args.source / folder / filename
    slug = re.sub(r'[^a-z0-9]+', '-', source.stem.lower()).strip('-')
    stem = f'{collection.lower()}-{slug}'
    with Image.open(source) as original:
        photo = ImageOps.exif_transpose(original)
        if original.info.get('icc_profile'):
            photo = ImageCms.profileToProfile(photo,
                ImageCms.ImageCmsProfile(io.BytesIO(original.info['icc_profile'])),
                ImageCms.createProfile('sRGB'), outputMode='RGB')
        else:
            photo = photo.convert('RGB')
        variants = []
        for edge in (720, 1440, 2560):
            resized = photo.copy()
            resized.thumbnail((edge, edge), Image.Resampling.LANCZOS)
            name = f'{stem}-{edge}.webp'
            # New exports omit EXIF/GPS and use sRGB; only display pixels ship.
            resized.save(output / name, 'WEBP', quality=92, method=5, exif=b'')
            variants.append({'file': name, 'width': resized.width, 'height': resized.height})
    identifier = source.stem.replace('_(2)', '-B').replace(' ', '-')
    return collection, {'id': identifier, 'alt': alt, 'variants': variants}


jobs = [(key, folder, name, alt) for key, (folder, photos) in collections.items() for name, alt in photos]
missing = [str(args.source / folder / name) for _, folder, name, _ in jobs if not (args.source / folder / name).is_file()]
if missing:
    parser.error('Missing approved source photographs:\n' + '\n'.join(missing))
manifest = {key: [] for key in collections}
with ThreadPoolExecutor(max_workers=3) as pool:
    for key, photo in pool.map(convert, jobs):
        manifest[key].append(photo)
        print(f"Converted {key}: {photo['id']}", flush=True)
(output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
size = sum(p.stat().st_size for p in output.glob('*.webp'))
print(f'{len(jobs)} photographs, {len(jobs) * 3} display assets, {size / 1e6:.1f} MB total')
