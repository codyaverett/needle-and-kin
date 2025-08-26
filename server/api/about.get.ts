export default defineEventHandler(async () => {
  return {
    hero: {
      title: "About Needle & Kin",
      description: "Discover the story behind our crafting community and the passion that drives us to create, connect, and inspire."
    },
    story: {
      title: "Our Story",
      content: [
        "Needle & Kin was born from a simple belief: that every handmade creation carries within it a piece of the maker's heart. Founded in 2023, we started as a small collective of crafters who wanted to share not just techniques and tutorials, but the deeper connections that come from creating with our hands.",
        "What began as weekend crafting sessions among friends has grown into a vibrant community where makers of all skill levels come together to learn, share, and celebrate the art of handcrafting.",
        "We believe that in our digital world, there's something profoundly meaningful about slowing down, picking up a needle, thread, or yarn, and creating something beautiful with our own two hands."
      ]
    },
    mission: {
      title: "Our Mission",
      values: [
        {
          icon: "book",
          title: "Educate",
          description: "Provide clear, accessible tutorials and guides that make crafting approachable for beginners while offering inspiration for experienced makers."
        },
        {
          icon: "users",
          title: "Connect", 
          description: "Foster a supportive community where crafters can share their work, ask questions, and find encouragement in their creative journey."
        },
        {
          icon: "lightbulb",
          title: "Inspire",
          description: "Celebrate the beauty of handmade items and inspire others to discover the joy and mindfulness that comes from creating with their hands."
        }
      ]
    },
    team: {
      title: "Meet Our Team",
      description: "Our diverse team brings together decades of crafting experience, from traditional embroidery and knitting to modern upcycling and sustainable fashion. Each contributor shares a passion for teaching and a love for the meditative, creative process of making.",
      members: [
        {
          name: "Sarah Chen",
          role: "Master Embroiderer & Tutorial Creator",
          avatar: "/avatars/sarah.jpg",
          bio: "Master embroiderer with 15 years of experience"
        },
        {
          name: "Maria Rodriguez", 
          role: "Knitting Instructor & Pattern Designer",
          avatar: "/avatars/maria.jpg",
          bio: "Knitting instructor and pattern designer"
        },
        {
          name: "Emily Johnson",
          role: "Sustainable Fashion Advocate", 
          avatar: "/avatars/emily.jpg",
          bio: "Sustainable fashion advocate and designer"
        }
      ]
    },
    cta: {
      title: "Join Our Community",
      description: "Whether you're just starting your crafting journey or you're a seasoned maker, there's a place for you in our community.",
      buttons: [
        {
          text: "Read Our Blog",
          url: "/blog",
          type: "primary"
        },
        {
          text: "Get In Touch", 
          url: "/contact",
          type: "secondary"
        }
      ]
    }
  }
})