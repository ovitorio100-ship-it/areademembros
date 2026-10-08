# Mapa Psi — biblioteca visual

Área de estudo estática com **150 mapas visuais de Psicologia**, organizados em seis eixos. Inclui busca, filtro por eixo, visualização ampliada, favoritos no navegador e download individual em PNG.

## Publicação na Vercel

1. Importe este repositório na Vercel.
2. Selecione **Other** como framework, sem comando de build. O `index.html` está na raiz.
3. Publique e teste a URL gerada em computador e celular.
4. Use essa URL na configuração de entrega por link da Cakto e faça uma compra de teste.

Não há login, Supabase, webhook ou variáveis de ambiente. O link é público e pode ser compartilhado. `robots.txt` e `X-Robots-Tag` pedem aos buscadores que não indexem a biblioteca, mas não restringem acesso.

## Conteúdo

| Eixo | Mapas |
| --- | ---: |
| Teorias da Personalidade e Sistemas Psicológicos | 30 |
| Psicopatologia | 30 |
| Bases Biológicas do Comportamento | 25 |
| Desenvolvimento Humano | 25 |
| Metodologia de Pesquisa e Estatística | 20 |
| Avaliação Psicológica e Testes | 20 |
| **Total** | **150** |

Os arquivos estão em `assets/mapas/`, e o índice usado pela interface está em `catalog.js`. Os favoritos são armazenados no navegador do visitante.

## Teste local

Na raiz do repositório, execute `python -m http.server 4173` e acesse `http://localhost:4173/`.

**Escopo atual:** este repositório contém os 150 mapas. Flashcards e planner não estão incluídos nesta versão.
