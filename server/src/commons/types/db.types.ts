export interface RecentChat {
  id: string;
  avatar: string;
  name: string;
  intro?: string;
  content: string;
  contentType: string;
  time: string;
  messageType: string;
  onlineStatus?: 'online' | 'offline';
  unreadCount: number;
}
