const config = {
  title: 'BlogSite',

  permalinks: {
    "post": "/post/{year}/{month/{slug}",
    "tag": "/tag/{slug}",
  },
  classifier: [
    { id: 'post', params: { path: '/_posts/' }, type: 'directory' },
    { id: 'tag', params: { keys: ['tag', 'tags'] }, type: 'frontmatter' }
  ]
};

export default config;
