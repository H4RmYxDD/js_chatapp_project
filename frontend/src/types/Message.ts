export type Message = {
    id?: string;
    senderId: string;
    receiverId: string;
    content: string;
    parentMsgId: string;
    createdAt: string;
    isRead: boolean;
};