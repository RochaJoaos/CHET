--
-- PostgreSQL database dump
--

\restrict iy8Up5xq0ZLehlL4xnU2kz55dcb9UNiZHXwaHcIznRw59T1YNllg2xnEgKhmYub

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversation_participants (
    id uuid NOT NULL,
    conversation_id uuid,
    user_id uuid,
    role character varying(20) DEFAULT 'MEMBER'::character varying,
    joined_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.conversation_participants OWNER TO postgres;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id uuid NOT NULL,
    type character varying(20) NOT NULL,
    name character varying(100),
    created_by uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(50),
    avatar_url character varying(255),
    bio text,
    birth_date date,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: conversation_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversation_participants (id, conversation_id, user_id, role, joined_at) FROM stdin;
7b3b0bcd-b69a-46d1-85ee-0313224a49f4	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	MEMBER	2026-05-23 15:58:24.722909
2a7430ac-b595-49b5-bff5-8d30a9a1fdcb	b4ac76cc-8aa8-422d-9577-7fa9037661e6	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	MEMBER	2026-05-23 15:58:24.726814
827791e8-c931-4043-b2b2-540f869bc21b	eec9ec03-28c6-4148-8cf6-4af75cf36693	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	MEMBER	2026-05-24 15:38:29.992212
4fd68030-1cff-4ca9-bc6f-bac3dc6b9835	eec9ec03-28c6-4148-8cf6-4af75cf36693	e22f0085-7562-471d-bf10-63be32ab6568	MEMBER	2026-05-24 15:38:29.994061
bb678951-f121-462d-8599-39205e7b41ff	332f9680-532a-4ceb-9c79-bc5f195c0b89	5ef85356-fd93-4df8-8f61-3eb4bd7c490d	MEMBER	2026-05-25 18:33:34.019695
bbe13520-4025-42b0-a8fd-6a69bb874f14	332f9680-532a-4ceb-9c79-bc5f195c0b89	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	MEMBER	2026-05-25 18:33:34.021293
8e46fe70-d1cb-4f59-800e-52f5ab7bbcc5	df360684-c8b0-4ca2-bc71-bd816ce76e47	5ef85356-fd93-4df8-8f61-3eb4bd7c490d	MEMBER	2026-05-25 19:57:51.653299
13492831-5256-4fe7-b861-4d887e43186f	df360684-c8b0-4ca2-bc71-bd816ce76e47	e22f0085-7562-471d-bf10-63be32ab6568	MEMBER	2026-05-25 19:57:51.654391
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, type, name, created_by, created_at) FROM stdin;
b4ac76cc-8aa8-422d-9577-7fa9037661e6	PRIVATE	\N	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	\N
eec9ec03-28c6-4148-8cf6-4af75cf36693	PRIVATE	\N	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	\N
332f9680-532a-4ceb-9c79-bc5f195c0b89	PRIVATE	\N	5ef85356-fd93-4df8-8f61-3eb4bd7c490d	\N
df360684-c8b0-4ca2-bc71-bd816ce76e47	PRIVATE	\N	5ef85356-fd93-4df8-8f61-3eb4bd7c490d	\N
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, conversation_id, sender_id, content, created_at) FROM stdin;
8e9da0da-a1c4-4ac1-afe8-38f262d2c505	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	Olá	2026-05-25 12:20:30.884323
379e5ffb-5c21-448d-95a6-9e6bbfa8680e	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	como vai?	2026-05-25 12:49:22.58844
6cb8fd77-e2e4-4332-8931-9b71dbaeef71	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	<3	2026-05-25 12:53:22.120014
d1534fa7-64cd-453f-8a51-a5dfa40102e3	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	oi barbs	2026-05-25 13:12:24.601077
95078ed6-00d7-459c-928c-7c3a884f0848	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	oi	2026-05-25 13:56:36.540202
ce53e5b6-2c87-44f5-9c61-cb72d7f1a13f	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	<3	2026-05-25 13:58:39.676032
45a49eab-a50f-4329-84d6-de38a0771d8f	b4ac76cc-8aa8-422d-9577-7fa9037661e6	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	joao disse	2026-05-25 14:04:38.39832
4d8414d0-7700-4d7a-a019-4c53da35ed01	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	agora	2026-05-25 14:50:54.791519
8971d9da-3f64-48ce-bc04-c65d6ebee03c	b4ac76cc-8aa8-422d-9577-7fa9037661e6	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est quis aute tempor sit pariatur ad ut cillum qui dolor ullamco voluptate in ad. Dolor ullamco duis magna culpa dolor sunt do occaecat eiusmod. Laboris aute excepteur voluptate proident quis eu in elit sint mollit. Laborum proident fugiat veniam veniam laboris nisi do pariatur do.	2026-05-25 14:55:02.126941
f94835b2-62b1-4f40-8eb0-097f4ed83b3a	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	novo teste	2026-05-25 15:56:25.68322
c6d817ed-1424-4a35-b0d2-e43b2b9056fc	b4ac76cc-8aa8-422d-9577-7fa9037661e6	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	kkkk	2026-05-25 16:09:46.321636
b48d79bc-15e3-43b9-be50-082365c9cb09	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	rsrs	2026-05-25 16:10:08.580203
3b9119ee-3088-4a43-bb0f-600a53935629	b4ac76cc-8aa8-422d-9577-7fa9037661e6	71ce6033-87b2-4f14-9f99-d4f5f29d12ef	baleias	2026-05-25 16:10:27.386142
ac71d21a-5258-43bd-ab62-8f1654c7c082	332f9680-532a-4ceb-9c79-bc5f195c0b89	5ef85356-fd93-4df8-8f61-3eb4bd7c490d	olá, boa noite	2026-05-25 18:34:10.814393
3c954a30-5356-4c65-9bf2-fc16378bd963	332f9680-532a-4ceb-9c79-bc5f195c0b89	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	oi	2026-05-25 18:35:49.601859
35328b7d-b4e0-41cc-bbd6-8511cfd65395	332f9680-532a-4ceb-9c79-bc5f195c0b89	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	tomanocu	2026-05-25 18:57:51.748208
d9433489-a66c-44c7-95f8-c969d96823f4	332f9680-532a-4ceb-9c79-bc5f195c0b89	5ef85356-fd93-4df8-8f61-3eb4bd7c490d	oi tu	2026-05-25 19:02:26.05191
aef9c6c4-bfab-4aac-a019-873fe952d9ef	332f9680-532a-4ceb-9c79-bc5f195c0b89	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	fff	2026-05-25 19:02:48.381135
54dabb71-ae5d-4a82-9f65-cc11435a2656	b4ac76cc-8aa8-422d-9577-7fa9037661e6	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	ggg	2026-05-25 19:03:11.884199
ac8b511a-48a9-440d-853f-ca5194be6dd5	b4ac76cc-8aa8-422d-9577-7fa9037661e6	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	aaa	2026-05-25 19:03:32.245148
09f89fca-1460-4c54-8144-51a7a44d5438	b4ac76cc-8aa8-422d-9577-7fa9037661e6	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	attt	2026-05-25 19:03:40.444528
66fe00ea-df76-4e2c-a3eb-868607fb8165	332f9680-532a-4ceb-9c79-bc5f195c0b89	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	ttt	2026-05-25 19:55:33.527327
056a98c4-4e12-4578-9971-a6d375f2cc53	332f9680-532a-4ceb-9c79-bc5f195c0b89	5ef85356-fd93-4df8-8f61-3eb4bd7c490d	oi	2026-05-25 19:55:56.558311
d703770d-91f3-4d68-ac11-73180a49bdd3	332f9680-532a-4ceb-9c79-bc5f195c0b89	5ef85356-fd93-4df8-8f61-3eb4bd7c490d	oi	2026-05-25 19:58:06.634586
f52a4653-3ded-4d31-a9dc-729aafb8f508	332f9680-532a-4ceb-9c79-bc5f195c0b89	8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	ola	2026-05-25 19:58:45.595734
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, username, avatar_url, bio, birth_date, created_at, updated_at) FROM stdin;
8ff07e0d-bbb4-42cc-9819-fe1b9faa8493	joao	souza.joaohenrique.rocha@gmail.com	$2a$10$ixPOe0CytlJbHjOuYV3Bzut.BiWXFzXRJUYly7XHlIcf9x9C08pGy	\N	\N	\N	\N	2026-05-04 13:33:43.502976	2026-05-04 13:33:43.502976
e22f0085-7562-471d-bf10-63be32ab6568	messi	messi@email.com	$2a$10$vbSxsP8zDmRE8MPpsbON.uyshTmXg1D7H6sxJiuGsBGCB7zmWWRX6	\N	\N	\N	\N	2026-05-04 13:33:43.502976	2026-05-04 13:33:43.502976
71ce6033-87b2-4f14-9f99-d4f5f29d12ef	barbs	barbs@email.com	$2a$10$Sp3L4KJR4XIhWFLEkJHuBOUIk5GNqX0J.OUtjMSMzkOzz3odL0G3S	\N	\N	\N	\N	2026-05-23 13:39:23.297757	2026-05-23 13:39:23.297757
5ef85356-fd93-4df8-8f61-3eb4bd7c490d	leo	leo@email.com	$2a$10$3w0naKwMoDtGuHvXBgLzaeOMyiQj148Y6xchGslmuK18YBHZklfn6	\N	\N	\N	\N	2026-05-25 18:33:29.141925	2026-05-25 18:33:29.141925
\.


--
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: conversation_participants conversation_participants_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id);


--
-- Name: conversation_participants conversation_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: conversations conversations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict iy8Up5xq0ZLehlL4xnU2kz55dcb9UNiZHXwaHcIznRw59T1YNllg2xnEgKhmYub

