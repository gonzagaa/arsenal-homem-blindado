# Pendências

Nada marcado com `.pendente` vai ao ar. Atualize esta lista conforme as respostas chegarem.

## Bloqueadores para publicar

- [ ] **Links de checkout:** ainda não chegaram. Um link da Eduzz por rota (bio, sdr, tfg, story e cht). Enquanto o `CHECKOUTS` tiver placeholder, os botões não levam a lugar nenhum.
- [ ] **GTM e Pixel:** confirmar com o cliente se o Arsenal usa o mesmo GTM e o mesmo Pixel da Meta do Desprezado ou IDs próprios. Até lá, os IDs ficam como placeholder.
- [ ] **Pixel e token nos cinco checkouts:** confirmar com a gestora o pixel e o token da API de Conversões configurados em cada checkout da Eduzz do Arsenal, e o InitiateCheckout disparando ao abrir cada um.

## Insumos

- [ ] **Mesa da oferta:** a foto da mesa do palco (`assets/img/oferta-mesa.png`, trazida do Desprezado) tem a parede azul. Na Etapa 1, tentar levar a parede para o vinho pelo script de imagens (nome novo); se ficar artificial, o cliente providencia uma mesa nova.

## Confirmar antes de publicar

Estes itens aparecem na página sem a classe `.pendente`, então nada na tela avisa que faltam.

- [ ] "+12 mil homens transformados", "419 mil seguidores" e "2.700+ publicações" (hero e Quem está por trás): números atuais e de onde vêm.
- [ ] Preço de referência R$ 297 riscado: confirmar que é um preço praticado de verdade (regra de anúncio da Meta e do Código de Defesa do Consumidor).
- [ ] Garantia de 7 dias: prazo configurado na Eduzz para o produto e as condições que o checkout informa (o texto da garantia remete a elas).
- [ ] Autorização do Marcello para usar os prints de DM escolhidos (nomes e fotos cobertos). No Desprezado, o print-07 mostra um story com o rosto de uma mulher; se ele for escolhido, confirmar se pode aparecer.
- [ ] Respostas do FAQ: entrega em PDF por e-mail depois da confirmação do pagamento e o tempo de leitura ("o principal dá para ler numa noite").
- [ ] Política de privacidade: a página usa GTM e pixel (cookies). Verificar se existe uma política publicada para linkar no rodapé (LGPD e revisão de anúncios da Meta).
- [ ] Depois do primeiro deploy na Hostinger, conferir no domínio: `/` e `/index.html` respondendo 404 com a `404.html`; /bio/, /sdr/, /tfg/, /story/ e /cht/ abrindo a página; um endereço inventado em 404; http e www indo para https sem www; /docs/, /CLAUDE.md e /.git/config sem abrir; HTML com `Cache-Control: no-cache` e /assets/ com 1 ano; resposta comprimida. O WordPress antigo sai do domínio nesse deploy: conferir se sobra algum arquivo dele na raiz da hospedagem.

## Marcações `.pendente` na página (0)

Nenhuma. Se surgir um trecho entre colchetes na copy, marque com `.pendente` e liste aqui.
