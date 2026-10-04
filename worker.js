addEventListener('fetch', (event) => {
  event.respondWith(
    new Response(JSON.stringify({ ok: true, message: 'Worker da Trilha de Aprovação ativo.' }), {
      headers: { 'content-type': 'application/json' }
    })
  );
});
