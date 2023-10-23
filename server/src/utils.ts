export function getRoomName(userId1: string, userId2: string) {
    // Generate a unique room name based on user IDs
    return `room_${userId1}_${userId2}`
}