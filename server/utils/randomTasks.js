const tasks = [
    "Complete dashboard UI design",
    "Fix login page bugs",
    "Optimize database queries",
    "Write API documentation",
    "Test mobile responsiveness",
    "Prepare client presentation",
    "Update employee handbook",
    "Review quarterly analytics",
    "Plan team building event",
    "Organize code repository",
    "Create social media posts",
    "Respond to support tickets",
    "Conduct user testing",
    "Schedule server maintenance",
    "Onboard new team members"
  ];

 export const randomTasks = () => {
    const randomIndex = Math.floor(Math.random() * tasks.length);
    return tasks[randomIndex];
  }