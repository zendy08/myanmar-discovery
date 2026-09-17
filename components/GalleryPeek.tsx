import { GALLERY_SECTIONS } from "@/lib/gallery";

const peekPlate = GALLERY_SECTIONS[0].plates[0];

export default function GalleryPeek() {
  return (
    <section className="gallery-peek" id="gallery" aria-labelledby="galleryPeekTitle">
      <div className="gallery-peek-label reveal">
        <p className="kicker">
          <i /> {peekPlate.kicker}
        </p>
        <h2 id="galleryPeekTitle">
          {peekPlate.name}, <em>in the round.</em>
        </h2>
        <p className="lede">{peekPlate.lede}</p>
        <a className="gallery-peek-door" href="/gallery">
          The hall <span className="arrow" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
