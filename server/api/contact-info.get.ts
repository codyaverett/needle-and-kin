import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Get contact info from database
    const contactInfo = await prisma.siteContent.findUnique({
      where: { key: 'contact_info' }
    })

    let contactData = null
    if (contactInfo) {
      contactData = JSON.parse(contactInfo.content)
    }

    // Return structured contact page data
    return {
      hero: {
        title: "Get In Touch",
        description: "We'd love to hear from you! Whether you have questions, suggestions, or just want to share your latest creation."
      },
      form: {
        title: "Send Us a Message",
        subjects: [
          { value: "", label: "Select a subject" },
          { value: "general", label: "General Inquiry" },
          { value: "tutorial", label: "Tutorial Request" },
          { value: "collaboration", label: "Collaboration" },
          { value: "feedback", label: "Feedback" },
          { value: "technical", label: "Technical Support" },
          { value: "other", label: "Other" }
        ]
      },
      contactMethods: {
        title: "Other Ways to Connect",
        methods: [
          {
            icon: "email",
            title: "Email Us",
            description: "For general inquiries and support",
            contact: contactData?.email || "hello@needleandkin.com",
            url: `mailto:${contactData?.email || "hello@needleandkin.com"}`
          },
          {
            icon: "instagram",
            title: "Instagram",
            description: "Follow us for daily inspiration and behind-the-scenes content",
            contact: contactData?.social?.instagram || "@needleandkin",
            url: contactData?.social?.instagram ? `https://instagram.com/${contactData.social.instagram.replace('@', '')}` : "#"
          },
          {
            icon: "pinterest",
            title: "Pinterest",
            description: "Discover and save our tutorials and inspiration boards",
            contact: contactData?.social?.pinterest || "@needleandkin",
            url: contactData?.social?.pinterest ? `https://pinterest.com/${contactData.social.pinterest}` : "#"
          }
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
        questions: [
          {
            question: "How long does it take to get a response?",
            answer: "We typically respond to all inquiries within 24-48 hours during business days."
          },
          {
            question: "Can you create custom tutorials?",
            answer: "Yes! We love creating content based on community requests. Let us know what you'd like to learn."
          },
          {
            question: "Do you offer virtual workshops?",
            answer: "We're exploring virtual workshop options. Contact us to express your interest!"
          }
        ]
      },
      // Include raw contact data if needed by the frontend
      contactData: contactData || {
        email: 'hello@needleandkin.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Craft Lane',
          city: 'Creativille',
          state: 'CA',
          zip: '90210',
          country: 'USA'
        },
        social: {
          instagram: '@needleandkin',
          pinterest: 'needleandkin',
          youtube: 'NeedleAndKin',
          facebook: 'needleandkin'
        },
        hours: {
          weekday: '9:00 AM - 5:00 PM PST',
          weekend: '10:00 AM - 3:00 PM PST'
        }
      }
    }
  } catch (error) {
    console.error('Error fetching contact info:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch contact info'
    })
  }
})