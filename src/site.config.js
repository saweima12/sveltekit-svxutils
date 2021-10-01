const config = {
  title: 'BlogSite',
  classifier: [
    { id: 'post', params: { path: '/_posts/' }, type: 'directory' },
    { id: 'tag', params: { keys: ['tag', 'tags'] }, type: 'frontmatter' }
  ]
};

export default config;
