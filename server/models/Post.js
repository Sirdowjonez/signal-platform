// Post model stub
// Swap the stub store for a real Mongoose model when MongoDB is connected:
//
//   const mongoose = require('mongoose');
//   const PostSchema = new mongoose.Schema({ ... });
//   module.exports = mongoose.model('Post', PostSchema);

const posts = [];
let nextId = 1;

const Post = {
  schema: {
    id: 'number',
    title: 'string',
    slug: 'string',
    summary: 'string',
    content: 'string',
    source: 'string',
    sourceUrl: 'string',
    category: 'string',         // e.g. 'ai', 'finance', 'crypto'
    tags: 'array',
    imageUrl: 'string',
    author: 'string',
    isPremium: 'boolean',
    publishedAt: 'date',
    createdAt: 'date',
    updatedAt: 'date',
  },

  create(data) {
    const now = new Date();
    const post = {
      id: nextId++,
      title: data.title || '',
      slug: data.slug || '',
      summary: data.summary || '',
      content: data.content || '',
      source: data.source || '',
      sourceUrl: data.sourceUrl || '',
      category: data.category || 'general',
      tags: data.tags || [],
      imageUrl: data.imageUrl || null,
      author: data.author || 'SIGNAL',
      isPremium: data.isPremium || false,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : now,
      createdAt: now,
      updatedAt: now,
    };
    posts.push(post);
    return post;
  },

  findAll({ limit = 20, offset = 0, category } = {}) {
    let result = [...posts].sort((a, b) => b.publishedAt - a.publishedAt);
    if (category) result = result.filter(p => p.category === category);
    return result.slice(offset, offset + limit);
  },

  findById(id) {
    return posts.find(p => p.id === Number(id)) || null;
  },

  findBySlug(slug) {
    return posts.find(p => p.slug === slug) || null;
  },

  count() {
    return posts.length;
  },
};

module.exports = Post;
