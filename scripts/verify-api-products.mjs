import http from 'http';

http.get('http://localhost:3000/api/products', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const j = JSON.parse(d);
    console.log('Total Products:', j.totalCount);
    console.log('Categories in API:', j.categories.map(c => `${c.name} [${c.slug}] (${c._count?.products || 0})`));
  });
});

