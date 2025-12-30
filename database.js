// Simple localStorage-based database for chapter interactions
class ChapterDatabase {
    constructor() {
        this.storageKey = 'chapterInteractions';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getChapterData(chapterId) {
        const data = this.getData();
        if (!data[chapterId]) {
            data[chapterId] = {
                likes: 0,
                dislikes: 0,
                userLiked: false,
                userDisliked: false,
                comments: []
            };
            this.saveData(data);
        }
        return data[chapterId];
    }

    // Like/Dislike functionality
    toggleLike(chapterId) {
        const data = this.getData();
        const chapter = this.getChapterData(chapterId);
        
        if (chapter.userLiked) {
            // Remove like
            chapter.likes--;
            chapter.userLiked = false;
        } else {
            // Add like
            chapter.likes++;
            chapter.userLiked = true;
            
            // Remove dislike if exists
            if (chapter.userDisliked) {
                chapter.dislikes--;
                chapter.userDisliked = false;
            }
        }
        
        data[chapterId] = chapter;
        this.saveData(data);
        return chapter;
    }

    toggleDislike(chapterId) {
        const data = this.getData();
        const chapter = this.getChapterData(chapterId);
        
        if (chapter.userDisliked) {
            // Remove dislike
            chapter.dislikes--;
            chapter.userDisliked = false;
        } else {
            // Add dislike
            chapter.dislikes++;
            chapter.userDisliked = true;
            
            // Remove like if exists
            if (chapter.userLiked) {
                chapter.likes--;
                chapter.userLiked = false;
            }
        }
        
        data[chapterId] = chapter;
        this.saveData(data);
        return chapter;
    }

    // Comments functionality
    addComment(chapterId, username, comment) {
        if (!username.trim() || !comment.trim()) {
            throw new Error('Username and comment are required');
        }

        const data = this.getData();
        const chapter = this.getChapterData(chapterId);
        
        const newComment = {
            id: Date.now(),
            username: username.trim(),
            comment: comment.trim(),
            timestamp: new Date().toISOString(),
            timeAgo: 'now'
        };
        
        chapter.comments.unshift(newComment);
        data[chapterId] = chapter;
        this.saveData(data);
        
        return newComment;
    }

    deleteComment(chapterId, commentId) {
        const data = this.getData();
        const chapter = this.getChapterData(chapterId);
        
        chapter.comments = chapter.comments.filter(comment => comment.id !== commentId);
        data[chapterId] = chapter;
        this.saveData(data);
        
        return chapter;
    }

    getComments(chapterId) {
        const chapter = this.getChapterData(chapterId);
        return chapter.comments.map(comment => ({
            ...comment,
            timeAgo: this.getTimeAgo(comment.timestamp)
        }));
    }

    deleteComment(chapterId, commentId) {
        const data = this.getData();
        const chapter = this.getChapterData(chapterId);
        
        chapter.comments = chapter.comments.filter(comment => comment.id !== commentId);
        data[chapterId] = chapter;
        this.saveData(data);
        
        return chapter;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const commentTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - commentTime) / 1000);
        
        if (diffInSeconds < 60) return 'now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    // Get all chapter stats for homepage
    getAllChapterStats() {
        const data = this.getData();
        const stats = {};
        
        for (let i = 1; i <= 25; i++) {
            const chapterId = `chapter${i}`;
            stats[chapterId] = this.getChapterData(chapterId);
        }
        
        return stats;
    }
}

// Initialize database
const chapterDB = new ChapterDatabase();