# CHET
Descrição Geral

O sistema proposto consiste em uma plataforma web de comunicação em tempo real, permitindo a troca de mensagens privadas e em grupo entre usuários autenticados.
A aplicação visa resolver o problema da comunicação digital centralizada, oferecendo recursos modernos como envio de mensagens instantâneas, compartilhamento de arquivos e notificações em tempo real.
O sistema será desenvolvido com backend em Java (Spring Boot) e frontend em JavaScript, utilizando comunicação via WebSocket para garantir interatividade e baixa latência.

Objetivo do Sistema

Criar uma aplicação web de mensagens que permita:
Comunicação privada entre dois usuários
Criação de grupos de conversa
Envio de mensagens em tempo real
Compartilhamento de arquivos
Gerenciamento de usuários

Requisitos Funcionais (RF)

RF01 – O sistema deve permitir cadastro de usuários.
RF02 – O sistema deve permitir autenticação via login e senha.
RF03 – O sistema deve permitir atualização de perfil.
RF04 – O sistema deve permitir visualizar status online/offline.
RF05 – O sistema deve permitir criar conversas privadas.
RF06 – O sistema deve permitir criar grupos.
RF07 – O sistema deve permitir adicionar/remover participantes de grupos.
RF08 – O sistema deve permitir envio de mensagens em tempo real.
RF09 – O sistema deve permitir edição de mensagens.
RF10 – O sistema deve permitir exclusão de mensagens.
RF11 – O sistema deve permitir envio de arquivos.
RF12 – O sistema deve notificar usuários quando receberem novas mensagens.

Requisitos Não Funcionais (RNF)

RNF01 – O sistema deve entregar mensagens em tempo inferior a 200ms.
RNF02 – O sistema deve suportar múltiplas conexões simultâneas.
RNF03 – O sistema deve utilizar criptografia.
RNF04 – As senhas devem ser armazenadas de forma criptografada.
RNF05 – O sistema deve implementar autenticação baseada em token (JWT).
RNF07 – O sistema deve manter integridade dos dados mesmo sob alta carga.
RNF08 – O sistema deve garantir persistência das mensagens.
RNF09 – O sistema deve possuir mecanismo de backup periódico.

Backend:

Java
Spring Boot
Spring Security
WebSocket
PostgreSQL
MongoDB

Frontend:

JavaScript
React
WebSocket API
