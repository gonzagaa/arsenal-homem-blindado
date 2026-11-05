# Pendências

Nada marcado com `.pendente` vai ao ar. Atualize esta lista conforme as respostas chegarem.

## Bloqueadores para publicar

- [ ] **Links de checkout:** ainda não chegaram. Um link da Eduzz por rota (bio, sdr, tfg, story e cht). Hoje o `CHECKOUTS` (fim do `index.html`) tem `PENDENTE` em todas, e os botões não levam a lugar nenhum (o clique é cancelado e o console avisa no localhost). Quando chegarem: os seis valores do `CHECKOUTS` (o `padrao` com o da bio) e os `href="#checkout-pendente"` dos botões no HTML pelo link do `padrao`.
- [ ] **GTM e Pixel:** confirmar com o cliente se o Arsenal usa o mesmo GTM e o mesmo Pixel da Meta do Desprezado ou IDs próprios. Hoje `GTM_ID` e `PIXEL_ID` (primeiro script do `<head>`) e os dois `<noscript>` têm "PENDENTE", e nada de rastreio carrega. Depois dos IDs reais, medir a performance pelo PageSpeed na prévia da Netlify (ver `PROGRESSO.md`).
- [ ] **Pixel e token nos cinco checkouts:** confirmar com a gestora o pixel e o token da API de Conversões configurados em cada checkout da Eduzz do Arsenal, e o InitiateCheckout disparando ao abrir cada um.
- [ ] **Política de privacidade:** a página usa GTM e pixel (cookies). Verificar se existe uma política publicada para linkar no rodapé (LGPD e revisão de anúncios da Meta).

## Insumos

- [ ] **Mesa da oferta:** a parede azul da foto do Desprezado foi levada para um vinho escuro pelo `scripts/otimizar-imagens.mjs` (`oferta-mesa-vinho-escuro`; só os tons azuis mudaram, a mesa, o abajur e a poltrona ficaram iguais). Aguardando o cliente aprovar ou mandar uma mesa nova.

## Marcações `.pendente` na página (0)

Nenhuma. Se surgir um trecho entre colchetes na copy, marque com `.pendente` e liste aqui.
