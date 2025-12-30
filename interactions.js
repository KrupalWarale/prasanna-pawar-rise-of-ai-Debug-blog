// Chapter Interactions Manager
class ChapterInteractions {
    constructor(chapterId) {
        this.chapterId = chapterId;
        this.init();
    }

    init() {
        this.createInteractionElements();
        this.loadChapterData();
        this.bindEvents();
    }

    createInteractionElements() {
        // Create interactions container
        const interactionsHTML = `
            <div class="chapter-interactions">
                <div class="interaction-buttons">
                    <button class="like-btn" data-action="like">
                        <svg class="like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span class="like-count">0</span>
                    </button>
                    <button class="dislike-btn" data-action="dislike">
                        <svg class="dislike-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                        </svg>
                        <span class="dislike-count">0</span>
                    </button>
                </div>
            </div>

            <div class="comments-section">
                <div class="comments-header">
                    <h3 class="comments-title">Comments</h3>
                    <span class="comments-count">0 comments</span>
                </div>
                
                <div class="comment-input-container">
                    <input type="text" class="username-input" placeholder="Enter your username" required>
                    <div class="comment-input-wrapper">
                        <input type="text" class="comment-input" placeholder="Add a comment...">
                        <button class="comment-send-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="comments-list"></div>
            </div>
        `;

        // Find where to insert (after chapter body)
        const chapterBody = document.querySelector('.chapter-body');
        if (chapterBody) {
            chapterBody.insertAdjacentHTML('afterend', interactionsHTML);
        }
    }

    loadChapterData() {
        const data = chapterDB.getChapterData(this.chapterId);
        
        // Update like/dislike counts and states
        this.updateLikeButton(data.likes, data.userLiked);
        this.updateDislikeButton(data.dislikes, data.userDisliked);
        
        // Load comments
        this.loadComments();
    }

    updateLikeButton(count, isLiked) {
        const likeBtn = document.querySelector('.like-btn');
        const likeCount = document.querySelector('.like-count');
        
        if (likeBtn && likeCount) {
            likeCount.textContent = count;
            likeBtn.classList.toggle('active', isLiked);
        }
    }

    updateDislikeButton(count, isDisliked) {
        const dislikeBtn = document.querySelector('.dislike-btn');
        const dislikeCount = document.querySelector('.dislike-count');
        
        if (dislikeBtn && dislikeCount) {
            dislikeCount.textContent = count;
            dislikeBtn.classList.toggle('active', isDisliked);
        }
    }

    loadComments() {
        const comments = chapterDB.getComments(this.chapterId);
        const commentsList = document.querySelector('.comments-list');
        const commentsCount = document.querySelector('.comments-count');
        
        if (commentsList && commentsCount) {
            commentsCount.textContent = `${comments.length} comment${comments.length !== 1 ? 's' : ''}`;
            
            commentsList.innerHTML = comments.map(comment => `
                <div class="comment-item" data-comment-id="${comment.id}">
                    <div class="comment-meta">
                        <span class="comment-author">${this.escapeHtml(comment.username)}</span>
                        <span class="comment-time">${comment.timeAgo}</span>
                        <button class="comment-delete-btn" onclick="window.chapterInteractions.deleteComment(${comment.id})" title="Delete comment">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2,-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="comment-bubble">
                        ${this.escapeHtml(comment.comment)}
                    </div>
                </div>
            `).join('');
        }
    }

    bindEvents() {
        // Like/Dislike buttons and delete comments
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                e.preventDefault();
                this.handleLike();
            } else if (e.target.closest('.dislike-btn')) {
                e.preventDefault();
                this.handleDislike();
            } else if (e.target.closest('.comment-send-btn')) {
                e.preventDefault();
                this.handleAddComment();
            } else if (e.target.closest('.delete-comment-btn')) {
                e.preventDefault();
                const commentId = parseInt(e.target.closest('.comment-item').dataset.commentId);
                this.handleDeleteComment(commentId);
            }
        });

        // Enter key for comment input
        document.addEventListener('keypress', (e) => {
            if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
                e.preventDefault();
                this.handleAddComment();
            }
        });
    }

    handleLike() {
        try {
            const data = chapterDB.toggleLike(this.chapterId);
            this.updateLikeButton(data.likes, data.userLiked);
            this.updateDislikeButton(data.dislikes, data.userDisliked);
            
            // Add animation
            const likeBtn = document.querySelector('.like-btn');
            likeBtn.classList.add('animate-click');
            setTimeout(() => likeBtn.classList.remove('animate-click'), 300);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }

    handleDislike() {
        try {
            const data = chapterDB.toggleDislike(this.chapterId);
            this.updateLikeButton(data.likes, data.userLiked);
            this.updateDislikeButton(data.dislikes, data.userDisliked);
            
            // Add animation
            const dislikeBtn = document.querySelector('.dislike-btn');
            dislikeBtn.classList.add('animate-click');
            setTimeout(() => dislikeBtn.classList.remove('animate-click'), 300);
        } catch (error) {
            console.error('Error toggling dislike:', error);
        }
    }

    handleAddComment() {
        const usernameInput = document.querySelector('.username-input');
        const commentInput = document.querySelector('.comment-input');
        
        if (!usernameInput || !commentInput) return;
        
        const username = usernameInput.value.trim();
        const comment = commentInput.value.trim();
        
        if (!username) {
            this.showError('Please enter your username');
            usernameInput.focus();
            return;
        }
        
        if (!comment) {
            this.showError('Please enter a comment');
            commentInput.focus();
            return;
        }
        
        try {
            chapterDB.addComment(this.chapterId, username, comment);
            commentInput.value = '';
            this.loadComments();
            
            // Add success animation
            const sendBtn = document.querySelector('.comment-send-btn');
            sendBtn.classList.add('animate-success');
            setTimeout(() => sendBtn.classList.remove('animate-success'), 500);
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    handleDeleteComment(commentId) {
        if (confirm('Are you sure you want to delete this comment?')) {
            try {
                chapterDB.deleteComment(this.chapterId, commentId);
                this.loadComments();
                
                // Show success message
                this.showSuccess('Comment deleted successfully');
            } catch (error) {
                this.showError('Error deleting comment');
            }
        }
    }

    showError(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const inputContainer = document.querySelector('.comment-input-container');
        inputContainer.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    showSuccess(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const inputContainer = document.querySelector('.comment-input-container');
        inputContainer.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 2000);
    }

    deleteComment(commentId) {
        try {
            chapterDB.deleteComment(this.chapterId, commentId);
            
            // Reload comments to update the display
            this.loadComments();
            
            // Show success feedback
            this.showSuccess('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
            this.showError('Failed to delete comment');
        }
    }

    showSuccess(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const inputContainer = document.querySelector('.comment-input-container');
        inputContainer.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Auto-initialize on chapter pages
document.addEventListener('DOMContentLoaded', () => {
    // Extract chapter ID from URL or page
    const path = window.location.pathname;
    const chapterMatch = path.match(/chapter(\d+)\.html/);
    
    if (chapterMatch) {
        const chapterId = `chapter${chapterMatch[1]}`;
        window.chapterInteractions = new ChapterInteractions(chapterId);
    }
});