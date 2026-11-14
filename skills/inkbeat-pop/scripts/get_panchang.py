"""Download Panchang (Indian Type Foundry, ITF Free Font License) from Fontshare into a project's public/fonts.

The font is NOT bundled with this skill: the ITF FFL forbids redistributing the font files. Each user downloads
their own copy from Fontshare and is bound by the license (FFL-Panchang.txt is copied next to the fonts).

Usage: python -I get_panchang.py <project-dir>
"""
import io
import pathlib
import sys
import urllib.request
import zipfile

URL = "https://api.fontshare.com/v2/fonts/download/panchang"
WANT = {"Panchang-Bold.ttf", "Panchang-Extrabold.ttf"}


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    dest = pathlib.Path(sys.argv[1]) / "public" / "fonts"
    dest.mkdir(parents=True, exist_ok=True)
    if all((dest / f).exists() for f in WANT):
        print("Panchang already present in", dest)
        return 0
    print("downloading", URL)
    data = urllib.request.urlopen(URL, timeout=60).read()
    got = set()
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        for n in z.namelist():
            base = n.rsplit("/", 1)[-1]
            if base in WANT and "/WEB/fonts/" in n:
                (dest / base).write_bytes(z.read(n))
                got.add(base)
            elif base == "FFL.txt":
                (dest / "FFL-Panchang.txt").write_bytes(z.read(n))
    missing = WANT - got
    if missing:
        print("missing from the archive:", ", ".join(sorted(missing)))
        return 1
    print("installed", ", ".join(sorted(got)), "->", dest)
    return 0


if __name__ == "__main__":
    sys.exit(main())
