import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Get homepage content from database
    const homepageContent = await prisma.siteContent.findUnique({
      where: { key: 'homepage_hero' }
    })

    if (homepageContent) {
      const hero = JSON.parse(homepageContent.content)
      
      // Also get about section content
      const aboutSectionContent = await prisma.siteContent.findUnique({
        where: { key: 'about_content' }
      })
      
      let aboutSection = {
        title: "About Needle & Kin",
        description: "We believe that every stitch tells a story.",
        cta: {
          text: "Learn More About Us",
          url: "/about"
        }
      }
      
      if (aboutSectionContent) {
        const aboutData = JSON.parse(aboutSectionContent.content)
        aboutSection = {
          title: "About Needle & Kin",
          description: aboutData.story?.content?.[0]?.substring(0, 200) + '...' || aboutSection.description,
          cta: {
            text: "Learn More About Us",
            url: "/about"
          }
        }
      }
      
      return {
        hero,
        aboutSection
      }
    }

    // Fallback to default content if not in database
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
        description: "We believe that every stitch tells a story, every creation builds connection, and every handmade piece carries the love and intention of its maker.",
        cta: {
          text: "Learn More About Us",
          url: "/about"
        }
      }
    }
  } catch (error) {
    console.error('Error fetching site content:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch site content'
    })
  }
})