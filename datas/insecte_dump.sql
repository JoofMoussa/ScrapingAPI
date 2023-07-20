--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: insecte; Type: TABLE; Schema: public; Owner: musajoof
--

CREATE TABLE public.insecte (
    id integer NOT NULL,
    id_service integer,
    nom character varying(150),
    image_url character varying(150),
    description_insecte text,
    partie1 text,
    partie2 text,
    famille text,
    diagnostic text,
    id_service_reference integer
);


ALTER TABLE public.insecte OWNER TO musajoof;

--
-- Name: insecte_id_seq; Type: SEQUENCE; Schema: public; Owner: musajoof
--

CREATE SEQUENCE public.insecte_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.insecte_id_seq OWNER TO musajoof;

--
-- Name: insecte_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: musajoof
--

ALTER SEQUENCE public.insecte_id_seq OWNED BY public.insecte.id;


--
-- Name: insecte id; Type: DEFAULT; Schema: public; Owner: musajoof
--

ALTER TABLE ONLY public.insecte ALTER COLUMN id SET DEFAULT nextval('public.insecte_id_seq'::regclass);


--
-- Data for Name: insecte; Type: TABLE DATA; Schema: public; Owner: musajoof
--

COPY public.insecte (id, id_service, nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service_reference) FROM stdin;
\.


--
-- Name: insecte_id_seq; Type: SEQUENCE SET; Schema: public; Owner: musajoof
--

SELECT pg_catalog.setval('public.insecte_id_seq', 1, false);


--
-- Name: insecte insecte_pkey; Type: CONSTRAINT; Schema: public; Owner: musajoof
--

ALTER TABLE ONLY public.insecte
    ADD CONSTRAINT insecte_pkey PRIMARY KEY (id);


--
-- Name: insecte insecte_id_service_reference_fkey; Type: FK CONSTRAINT; Schema: public; Owner: musajoof
--

ALTER TABLE ONLY public.insecte
    ADD CONSTRAINT insecte_id_service_reference_fkey FOREIGN KEY (id_service_reference) REFERENCES public.service(id);


--
-- PostgreSQL database dump complete
--

