export const prismaGroupSelect = {
  id: true,
  avatar: true,
  intro: true,
  groupName: true,
  groupManager: { select: { username: true, email: true } },
  groupMessages: {
    select: { content: true, user: { select: { username: true } } },
  },
  members: { select: { username: true } },
};
