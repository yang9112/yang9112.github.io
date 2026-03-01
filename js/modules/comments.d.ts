declare class CommentsSystem {
    private storageKey;
    private comments;
    constructor();
    private loadComments;
    private saveComments;
    private generateId;
    private formatTimestamp;
    addComment(username: string, content: string, parentId?: string): void;
    private findComment;
    deleteComment(id: string): void;
    renderComments(): void;
    private renderComment;
    private escapeHtml;
    showReplyForm(parentId: string): void;
    cancelReply(parentId: string): void;
    private clearForm;
    private initializeEventListeners;
    getCommentsCount(): number;
}
declare global {
    interface Window {
        commentsSystem: CommentsSystem;
    }
}
export default CommentsSystem;
