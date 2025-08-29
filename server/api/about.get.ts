import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Get about content from database
    const aboutContent = await prisma.siteContent.findUnique({
      where: { key: 'about_content' }
    })

    if (aboutContent) {
      return JSON.parse(aboutContent.content)
    }

    // Fallback to default content if not in database
    return {
      hero: {
        title: "About Needle & Kin",
        description: "Discover the story behind our crafting community and the passion that drives us to create, connect, and inspire."
      },
      story: {
        title: "Our Story",
        content: [
          "Needle & Kin was born from a simple belief: that every handmade creation carries within it a piece of the maker's heart.",
          "What began as weekend crafting sessions among friends has grown into a vibrant community.",
          "We believe there's something profoundly meaningful about creating with our own two hands."
        ]
      },
      mission: {
        title: "Our Mission",
        values: []
      },
      team: {
        title: "Meet Our Team",
        description: "Our diverse team brings together decades of crafting experience.",
        members: []
      },
      cta: {
        title: "Join Our Community",
        description: "There's a place for you in our community.",
        buttons: []
      }
    }
  } catch (error) {
    console.error('Error fetching about content:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch about content'
    })
  }
})