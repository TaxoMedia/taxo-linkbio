import { describe, it, expect } from 'vitest';
import {
    escapeHTML,
    addPost,
    deletePost,
    publishPost,
    unpublishPost,
    trackClick,
    computeStats,
} from './utils.js';

// ---------------------------------------------------------------------------
// escapeHTML
// ---------------------------------------------------------------------------
describe('escapeHTML', () => {
    it('escapes angle brackets', () => {
        expect(escapeHTML('<script>')).toBe('&lt;script&gt;');
    });

    it('escapes ampersands', () => {
        expect(escapeHTML('a & b')).toBe('a &amp; b');
    });

    it('escapes double quotes', () => {
        expect(escapeHTML('"hello"')).toBe('&quot;hello&quot;');
    });

    it('escapes single quotes', () => {
        expect(escapeHTML("it's")).toBe('it&#39;s');
    });

    it('returns plain strings unchanged', () => {
        expect(escapeHTML('hello world')).toBe('hello world');
    });

    it('coerces non-strings to string', () => {
        expect(escapeHTML(42)).toBe('42');
        expect(escapeHTML(null)).toBe('null');
    });

    it('neutralises a full XSS payload', () => {
        const payload = '<img src=x onerror="alert(1)">';
        expect(escapeHTML(payload)).not.toContain('<');
        expect(escapeHTML(payload)).not.toContain('>');
    });
});

// ---------------------------------------------------------------------------
// addPost
// ---------------------------------------------------------------------------
describe('addPost', () => {
    it('appends a new post with defaults', () => {
        const posts = [];
        const result = addPost(posts, { id: 1, teaserCaption: 'Test', linkUrl: 'https://example.com' });
        expect(result).toHaveLength(1);
        expect(result[0].clicks).toBe(0);
        expect(result[0].status).toBe('draft');
    });

    it('does not mutate the original array', () => {
        const posts = [];
        addPost(posts, { id: 1 });
        expect(posts).toHaveLength(0);
    });

    it('preserves an explicit status', () => {
        const result = addPost([], { id: 2, status: 'published' });
        expect(result[0].status).toBe('published');
    });
});

// ---------------------------------------------------------------------------
// deletePost
// ---------------------------------------------------------------------------
describe('deletePost', () => {
    const posts = [{ id: 1 }, { id: 2 }, { id: 3 }];

    it('removes the post with the given id', () => {
        const result = deletePost(posts, 2);
        expect(result.map(p => p.id)).toEqual([1, 3]);
    });

    it('does nothing when id is not found', () => {
        const result = deletePost(posts, 99);
        expect(result).toHaveLength(3);
    });

    it('does not mutate the original array', () => {
        deletePost(posts, 1);
        expect(posts).toHaveLength(3);
    });
});

// ---------------------------------------------------------------------------
// publishPost / unpublishPost
// ---------------------------------------------------------------------------
describe('publishPost', () => {
    it('sets status to published for the target post', () => {
        const posts = [{ id: 1, status: 'draft' }, { id: 2, status: 'draft' }];
        const result = publishPost(posts, 1);
        expect(result[0].status).toBe('published');
        expect(result[1].status).toBe('draft');
    });
});

describe('unpublishPost', () => {
    it('sets status to draft for the target post', () => {
        const posts = [{ id: 1, status: 'published' }];
        const result = unpublishPost(posts, 1);
        expect(result[0].status).toBe('draft');
    });
});

// ---------------------------------------------------------------------------
// trackClick
// ---------------------------------------------------------------------------
describe('trackClick', () => {
    it('increments clicks for the target post', () => {
        const posts = [{ id: 1, clicks: 3 }, { id: 2, clicks: 0 }];
        const result = trackClick(posts, 1);
        expect(result[0].clicks).toBe(4);
        expect(result[1].clicks).toBe(0);
    });

    it('handles missing clicks field (treats as 0)', () => {
        const posts = [{ id: 1 }];
        const result = trackClick(posts, 1);
        expect(result[0].clicks).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// computeStats
// ---------------------------------------------------------------------------
describe('computeStats', () => {
    it('returns zero stats for an empty list', () => {
        expect(computeStats([])).toEqual({ totalPosts: 0, totalClicks: 0, avgCtr: 0 });
    });

    it('counts total posts', () => {
        const posts = [{ status: 'draft', clicks: 0 }, { status: 'published', clicks: 5 }];
        expect(computeStats(posts).totalPosts).toBe(2);
    });

    it('sums all clicks regardless of status', () => {
        const posts = [{ status: 'draft', clicks: 2 }, { status: 'published', clicks: 8 }];
        expect(computeStats(posts).totalClicks).toBe(10);
    });

    it('computes avgCtr as totalClicks / published count', () => {
        const posts = [
            { status: 'published', clicks: 10 },
            { status: 'published', clicks: 20 },
        ];
        expect(computeStats(posts).avgCtr).toBe(15);
    });

    it('returns avgCtr 0 when there are no published posts', () => {
        const posts = [{ status: 'draft', clicks: 50 }];
        expect(computeStats(posts).avgCtr).toBe(0);
    });
});
