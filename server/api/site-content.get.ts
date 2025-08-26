export default defineEventHandler(async () => {
  return {
    hero: {
      title: "Welcome to Needle & Kin",
      description: "Discover the art of crafting, creativity, and the beautiful connections we make through handmade treasures.",
      cta: {
        text: "Explore Our Blog",
        url: "/blog"
      }
    },
    aboutSection: {
      title: "About Needle & Kin",
      description: "We believe that every stitch tells a story, every creation builds connection, and every handmade piece carries the love and intention of its maker. Join us on this journey of creativity and craftsmanship.",
      cta: {
        text: "Learn More About Us",
        url: "/about"
      }
    }
  }
})