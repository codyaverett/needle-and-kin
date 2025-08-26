export default defineEventHandler(async () => {
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
          contact: "hello@needleandkin.com",
          url: "mailto:hello@needleandkin.com"
        },
        {
          icon: "instagram",
          title: "Instagram",
          description: "Follow us for daily inspiration and behind-the-scenes content",
          contact: "@needleandkin",
          url: "#"
        },
        {
          icon: "pinterest",
          title: "Pinterest", 
          description: "Discover and save our tutorials and inspiration boards",
          contact: "@needleandkin",
          url: "#"
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
    }
  }
})