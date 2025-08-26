export default defineEventHandler(async () => {
  return {
    availableTags: [
      'embroidery', 
      'knitting', 
      'upcycling', 
      'cross-stitch', 
      'macrame', 
      'tutorial', 
      'beginner'
    ],
    postsPerPage: 10,
    featuredCategories: [
      {
        name: 'Tutorial',
        tag: 'tutorial',
        description: 'Step-by-step guides for all skill levels'
      },
      {
        name: 'Beginner Friendly',
        tag: 'beginner', 
        description: 'Perfect projects for those just starting out'
      },
      {
        name: 'Sustainable Crafting',
        tag: 'upcycling',
        description: 'Eco-friendly projects that give new life to old materials'
      }
    ]
  }
})