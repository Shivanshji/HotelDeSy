import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const h = React.createElement;

const images = {
  pool: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1300&q=82",
  roomA: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=82",
  roomB: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=82",
  terrace: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1500&q=82",
  dinner: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1000&q=82"
};

const navItems = [
  ["Stay", "#stay"],
  ["Rooms", "#rooms"],
  ["Amenities", "#amenities"],
  ["Location", "#location"]
];

const facts = [
  ["Check-in", "12 PM"],
  ["Check-out", "12 PM"],
  ["Rating", "3.9 / 5"],
  ["City centre", "15.3 km"]
];

const rooms = [
  {
    name: "Deluxe Double Room",
    detail: "168 sq.ft / city view",
    copy: "Double bed, one bathroom, air conditioning, and room-only or breakfast plans.",
    image: images.roomA
  },
  {
    name: "Royal Deluxe Room",
    detail: "195 sq.ft / queen bed",
    copy: "A little more room to settle in, with public listings showing free cancellation options.",
    image: images.roomB
  }
];

const amenities = [
  "Swimming pool",
  "Restaurant",
  "Bar and lounge",
  "Fitness centre",
  "Wi-Fi",
  "Housekeeping",
  "Air conditioning",
  "First aid"
];

function useMotionSetup() {
  useEffect(() => {
    const root = document.documentElement;
    const cursor = document.querySelector(".cursor-dot");
    let targetX = window.innerWidth - 90;
    let targetY = window.innerHeight - 90;
    let currentX = targetX;
    let currentY = targetY;
    let frameId;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));

    const onPointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const onScroll = () => {
      root.style.setProperty("--page-scroll", String(window.scrollY));
      root.style.setProperty("--scroll-ratio", String(window.scrollY / Math.max(1, window.innerHeight)));
      document.querySelectorAll(".scroll-gallery").forEach((gallery) => {
        const rect = gallery.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / travel));
        gallery.style.setProperty("--gallery-progress", progress.toFixed(4));
        gallery.style.setProperty("--overlay-one", revealWindow(progress, 0.08, 0.27, 0.5, 0.68).toFixed(4));
        gallery.style.setProperty("--overlay-two", revealWindow(progress, 0.44, 0.62, 0.78, 0.96).toFixed(4));
      });
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      if (cursor) {
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    animate();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frameId);
      revealObserver.disconnect();
    };
  }, []);
}

function revealWindow(progress, enterStart, enterEnd, exitStart, exitEnd) {
  const enter = smoothstep(enterStart, enterEnd, progress);
  const exit = 1 - smoothstep(exitStart, exitEnd, progress);
  return Math.min(1, Math.max(0, enter * exit));
}

function smoothstep(edge0, edge1, value) {
  const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
  }, [open]);

  return h(
    React.Fragment,
    null,
    h(
      "header",
      { className: "site-header", "aria-label": "Primary navigation" },
      h("a", { className: "brand-eyes", href: "#top", "aria-label": "Hotel De Symphony home" },
        h("span", null),
        h("span", null)
      ),
      h("a", { className: "wordmark", href: "#top" },
        h("small", null, "Hotel De"),
        h("strong", null, "Symphony")
      ),
      h(
        "nav",
        { className: "nav-links", "aria-label": "Page sections" },
        navItems.map(([label, href]) => h("a", { key: label, href }, label))
      ),
      h(
        "button",
        {
          className: "menu-toggle",
          type: "button",
          "aria-label": open ? "Close menu" : "Open menu",
          "aria-expanded": open,
          onClick: () => setOpen((value) => !value)
        },
        h("span", null),
        h("span", null),
        h("span", null)
      )
    ),
    h(
      "aside",
      { className: "menu-panel", "aria-hidden": !open },
      navItems.concat([["Book", "#contact"]]).map(([label, href], index) =>
        h(
          "a",
          {
            key: label,
            href,
            style: { "--item-index": index },
            onClick: () => setOpen(false)
          },
          label
        )
      )
    )
  );
}

function SplitText({ children, as = "h2", className = "", ...props }) {
  const words = useMemo(() => String(children).split(" "), [children]);
  return h(
    as,
    { ...props, className: `split-text ${className}`, "data-reveal": true },
    words.map((word, index) =>
      h("span", { className: "word-mask", key: `${word}-${index}` },
        h("span", { style: { "--word-index": index } }, `${word}${index < words.length - 1 ? " " : ""}`)
      )
    )
  );
}

function Hero() {
  return h(
    "section",
    { className: "hero", id: "top", "aria-labelledby": "hero-title" },
    h("div", { className: "hero-copy" },
      h("p", { className: "eyebrow", "data-reveal": true }, "Nawanshahr, Punjab"),
      h(SplitText, { as: "h1", className: "hero-title", id: "hero-title" }, "Hotel De Symphony"),
      h("p", { className: "intro", "data-reveal": true },
        "A dark blue and gold hotel identity for a practical city stay by Topaz."
      ),
      h("div", { className: "hero-actions", "data-reveal": true },
        h("a", { className: "primary-action", href: "#rooms" }, "Explore rooms"),
        h("a", { className: "secondary-action", href: "#location" }, "Find us")
      )
    )
  );
}

function ScrollGallery() {
  return h(
    "section",
    { className: "scroll-gallery", "aria-label": "Scroll animated hotel image sequence" },
    h("div", { className: "gallery-sticky" },
      h("figure", { className: "gallery-image gallery-base" },
        h("img", { src: images.pool, alt: "Premium hotel pool and terrace" })
      ),
      h("figure", { className: "gallery-image gallery-overlay gallery-overlay-one" },
        h("img", { src: images.roomA, alt: "Hotel De Symphony guest room" })
      ),
      h("figure", { className: "gallery-image gallery-overlay gallery-overlay-two" },
        h("img", { src: images.dinner, alt: "Hotel dining and lounge atmosphere" })
      ),
      h("div", { className: "gallery-orbit", "aria-hidden": true }),
      h("div", { className: "gallery-caption", "aria-hidden": true },
        h("span", null, "Pool"),
        h("span", null, "Rooms"),
        h("span", null, "Dining")
      )
    )
  );
}

function Statement() {
  return h(
    "section",
    { className: "statement", id: "stay" },
    h("div", { className: "statement-mark", "aria-hidden": true }, "S"),
    h("p", { className: "eyebrow", "data-reveal": true }, "By Topaz"),
    h(SplitText, null, "A composed stay with the confidence of a city address."),
    h("p", { "data-reveal": true },
      "Hotel De Symphony by Topaz is listed on Bamala Kalan Road, near Toor Colony, with comfortable rooms, dining, pool access, fitness facilities, and a clean midnight-to-midday rhythm for check-in and check-out."
    )
  );
}

function FactsBand() {
  return h(
    "section",
    { className: "facts-band", "aria-label": "Hotel quick facts" },
    facts.map(([label, value], index) =>
      h("article", { key: label, "data-reveal": true, style: { "--delay": `${index * 80}ms` } },
        h("span", null, label),
        h("strong", null, value)
      )
    )
  );
}

function Rooms() {
  return h(
    "section",
    { className: "rooms section-grid", id: "rooms", "aria-labelledby": "rooms-title" },
    h("div", { className: "section-kicker" },
      h("p", { className: "eyebrow", "data-reveal": true }, "Rooms"),
      h(SplitText, { as: "h2", className: "section-title" }, "Two signatures, one easy stay.")
    ),
    h("div", { className: "room-list" },
      rooms.map((room, index) =>
        h("article", { className: "room-card", key: room.name, "data-reveal": true },
          h("div", { className: "room-image" },
            h("img", { src: room.image, alt: room.name })
          ),
          h("div", { className: "room-content" },
            h("p", null, room.detail),
            h("h3", null, room.name),
            h("span", null, room.copy),
            h("small", null, index === 0 ? "Listed from INR 1,865" : "Royal comfort plan")
          )
        )
      )
    )
  );
}

function Amenities() {
  return h(
    "section",
    { className: "amenities", id: "amenities" },
    h("p", { className: "eyebrow", "data-reveal": true }, "Amenities"),
    h(SplitText, { as: "h2" }, "The essentials tuned in gold."),
    h("div", { className: "amenity-marquee", "aria-hidden": true },
      h("div", null,
        amenities.concat(amenities).map((item, index) => h("span", { key: `${item}-${index}` }, item))
      )
    ),
    h("div", { className: "amenity-grid" },
      amenities.slice(0, 6).map((item, index) =>
        h("article", { key: item, "data-reveal": true, style: { "--delay": `${index * 55}ms` } },
          h("span", { className: "mini-gold" }),
          h("h3", null, item),
          h("p", null, amenityCopy(item))
        )
      )
    )
  );
}

function amenityCopy(item) {
  const copy = {
    "Swimming pool": "Pool access and towels for quiet downtime between city plans.",
    Restaurant: "In-house dining for breakfast, dinner, and easy gatherings.",
    "Bar and lounge": "A relaxed place to pause, meet, and reset after travel.",
    "Fitness centre": "Simple fitness support for travellers who keep a routine.",
    "Wi-Fi": "Everyday connectivity for work, maps, and planning the next move.",
    Housekeeping: "Room care, toiletries, and practical comfort through the stay."
  };
  return copy[item] || "A listed guest facility for practical stays.";
}

function ImageBreak() {
  return h(
    "section",
    { className: "image-break", "aria-label": "Hotel hospitality visual" },
    h("img", { src: images.terrace, alt: "Hotel pool and terrace at dusk" }),
    h("div", { className: "image-break-copy" },
      h("p", { className: "eyebrow", "data-reveal": true }, "Symphony mood"),
      h(SplitText, { as: "h2" }, "Dark, polished, direct, and warm.")
    )
  );
}

function Location() {
  return h(
    "section",
    { className: "location section-grid", id: "location", "aria-labelledby": "location-title" },
    h("div", { className: "section-kicker" },
      h("p", { className: "eyebrow", "data-reveal": true }, "Location"),
      h(SplitText, { as: "h2", className: "section-title", id: "location-title" }, "Bamala Kalan Road, near Toor Colony.")
    ),
    h("div", { className: "location-card", "data-reveal": true },
      h("p", null,
        "Hotel De Symphony by Topaz is listed at Bamala Kalan Road, Near Toor Colony, Nawanshahr, Punjab 144514."
      ),
      h("dl", null,
        h("div", null,
          h("dt", null, "Nearest noted rail link"),
          h("dd", null, "Khatkar Kalan J Railway Station, 14.6 km")
        ),
        h("div", null,
          h("dt", null, "Nearby references"),
          h("dd", null, "Sri Harmandir Sahib, Shiv Mandir, Banga Railway Station")
        )
      ),
      h("a", {
        className: "primary-action",
        href: "https://www.google.com/maps/search/?api=1&query=Bamala%20Kalan%20Road%2C%20Near%20Toor%20Colony%2C%20Nawanshahr%2C%20Punjab%20144514"
      }, "Open map")
    )
  );
}

function Footer() {
  return h(
    "footer",
    { className: "site-footer", id: "contact" },
    h("div", null,
      h("p", { className: "eyebrow", "data-reveal": true }, "Hotel De Symphony by Topaz"),
      h(SplitText, { as: "h2" }, "Let the stay begin on the right note.")
    ),
    h("div", { className: "footer-details", "data-reveal": true },
      h("p", null, "Bamala Kalan Road, Near Toor Colony"),
      h("p", null, "Nawanshahr, Punjab 144514"),
      h("a", { className: "secondary-action", href: "#rooms" }, "Check room options")
    )
  );
}

function App() {
  useMotionSetup();
  return h(
    React.Fragment,
    null,
    h("div", { className: "loader", "aria-hidden": true },
      h("span", null),
      h("strong", null, "Symphony")
    ),
    h("div", { className: "cursor-dot", "aria-hidden": true }),
    h(Header),
    h("main", null,
      h(Hero),
      h(ScrollGallery),
      h(Statement),
      h(FactsBand),
      h(Rooms),
      h(Amenities),
      h(ImageBreak),
      h(Location),
      h(Footer)
    )
  );
}

createRoot(document.getElementById("root")).render(h(App));
