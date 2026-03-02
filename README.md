# CHET
1.	Visão Geral

    Este projeto consiste no desenvolvimento de uma plataforma web de comunicação em tempo real. O sistema permite troca de mensagens privadas e em grupo, envio de arquivos, notificações em tempo real e gerenciamento de usuários. A arquitetura foi planejada para ser escalável e performática, utilizando WebSockets para comunicação instantânea, banco de dados relacional.

2.	Tecnologias

    Frontend: React (JS), WebSocket.
    Backend: Java com Spring Boot, JWT.
    Banco de dados: PostgreSQL.

3.	Requisitos.

    Funcionais:
    •	RF01 – O sistema deve permitir cadastro de usuários.
    •	RF02 – O sistema deve permitir autenticação via login e senha.
    •	RF03 – O sistema deve permitir atualização de perfil.
    •	RF04 – O sistema deve permitir visualizar status online/offline.
    •	RF05 – O sistema deve permitir criar conversas privadas.
    •	RF06 – O sistema deve permitir criar grupos.
    •	RF07 – O sistema deve permitir adicionar/remover participantes de grupos.
    •	RF08 – O sistema deve permitir envio de mensagens em tempo real.
    •	RF09 – O sistema deve permitir edição de mensagens.
    •	RF10 – O sistema deve permitir exclusão de mensagens.
    •	RF11 – O sistema deve permitir envio de arquivos.
    •	RF12 – O sistema deve notificar usuários quando receberem novas mensagens.

    Não Funcionais:
    •	RNF01 – O sistema deve entregar mensagens em tempo inferior a 200ms.
    •	RNF02 – O sistema deve suportar múltiplas conexões simultâneas.
    •	RNF03 – O sistema deve utilizar criptografia.
    •	RNF04 – As senhas devem ser armazenadas de forma criptografada.
    •	RNF05 – O sistema deve implementar autenticação baseada em token (JWT).
    •	RNF06 – O sistema deve manter integridade dos dados mesmo sob alta carga.
    •	RNF07 – O sistema deve garantir persistência das mensagens.
    •	RNF08 – O sistema deve possuir mecanismo de backup periódico.
