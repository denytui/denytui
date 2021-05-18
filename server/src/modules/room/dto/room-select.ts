export const prismaRoomSelect = {
  id: true,
  name: true,
  description: true,
  users: { select: { username: true } },
  message: { select: { text: true, user: { select: { username: true } } } },
};
