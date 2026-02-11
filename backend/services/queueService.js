const reorderQueue = (queue) => {
    return queue.sort((a, b) => {
        const priority = {
            Emergency: 1,
            Urgent: 2,
            Normal: 3,
        };

        // First compare by Urgency Level
        if (priority[a.urgencyLevel] !== priority[b.urgencyLevel]) {
            return priority[a.urgencyLevel] - priority[b.urgencyLevel];
        }

        // If urgency is same, sort by CreatedAt (FIFO)
        return new Date(a.createdAt) - new Date(b.createdAt);
    });
};

export { reorderQueue };
