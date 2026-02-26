/**
 * Sanitize a string for safe insertion into HTML via innerHTML.
 */
export function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Add a new post to a posts array. Returns the updated array.
 */
export function addPost(posts, postData) {
    const newPost = {
        ...postData,
        id: postData.id ?? Date.now(),
        clicks: 0,
        status: postData.status ?? 'draft',
    };
    return [...posts, newPost];
}

/**
 * Delete a post by id. Returns the updated array.
 */
export function deletePost(posts, id) {
    return posts.filter(p => p.id !== id);
}

/**
 * Toggle a post's status between 'published' and 'draft'.
 */
export function publishPost(posts, id) {
    return posts.map(p => p.id === id ? { ...p, status: 'published' } : p);
}

export function unpublishPost(posts, id) {
    return posts.map(p => p.id === id ? { ...p, status: 'draft' } : p);
}

/**
 * Increment the click counter on a post. Returns the updated array.
 */
export function trackClick(posts, id) {
    return posts.map(p => p.id === id ? { ...p, clicks: (p.clicks || 0) + 1 } : p);
}

/**
 * Compute summary stats from a posts array.
 */
export function computeStats(posts) {
    const published = posts.filter(p => p.status === 'published');
    const totalClicks = posts.reduce((sum, p) => sum + (p.clicks || 0), 0);
    const avgCtr = published.length > 0
        ? Math.round(totalClicks / published.length)
        : 0;
    return { totalPosts: posts.length, totalClicks, avgCtr };
}
