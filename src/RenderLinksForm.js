export function RenderLinksForm(links) {
  return links.map((link) => {
    return {
      source: link.source.name,
      target: link.target.name,
      boundary: link.boundary ? 'good' : 'bad',
      reconsider: link.reconsider ? 'good' : 'bad',
      quality: link.quality ? 'good' : 'bad',
    };
  });
}
