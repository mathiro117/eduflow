# 🎓 Facilita SENAI — Central Escolar Digital (CED)
> **MVP Funcional Desenvolvido para Apresentação Acadêmica no SENAI Vila Leopoldina**  
> *Metodologia de Desenvolvimento: Circuito Lean Scripting (Ciclos 1 a 6)*

---

## 📌 1. Visão Geral & Proposta de Valor

O **Facilita SENAI** é uma plataforma corporativa web desenvolvida para modernizar, digitalizar e centralizar as rotinas operacionais escolares. 

### 🛑 O Problema Resolvido:
Nas unidades escolares tradicionais, as rotinas diárias sofrem com gargalos operacionais:
- Diários de classe e chamadas preenchidos manualmente ou em sistemas lentos;
- Falta de controle imediato sobre atrasos pontuais na portaria;
- Registro disperso de advertências e falta de conformidade no uso de uniformes/EPIs em oficinas;
- Atestados médicos entregues em papel, que demoram dias para chegar ao diário do professor e frequentemente geram faltas indevidas;
- Ausência de um prontuário único consolidado para a coordenação tomar decisões pedagógicas rápidas.

### 🚀 A Solução do Facilita SENAI:
Uma **Central Escolar Digital única, integrada em tempo real e acessível por qualquer dispositivo móvel ou desktop**, eliminando papéis e planilhas paralelas através de fluxos automatizados em cascata.

---

## ⚡ 2. Principais Funcionalidades Integradas

| Módulo | Descrição do Fluxo Operacional | Diferencial de Destaque |
| :--- | :--- | :--- |
| **📊 Dashboard Dinâmico** | Painel executivo com métricas em tempo real (Alunos Ativos, Atrasos do Dia, Desvios Pendentes, Atestados em Análise). | Boas-vindas e atalhos customizados de acordo com o perfil conectado. |
| **📋 Frequência & Chamada** (`/frequencia`) | Diário de classe digital com seleção de turma e data, botão *"Marcar Todos como Presentes"* e estados semafóricos. | **Registro de Atraso em Minutos** (+5m, +10m, +15m, +20m, +30m) com justificativa imediata. |
| **⚠️ Ocorrências & Uniforme** (`/ocorrencias`) | Lançamento de desvios de vestimenta, calçado inadequado para oficinas e infrações disciplinares. | **Cálculo Inteligente de Reincidência:** alerta se é 1º registro, atenção (1 anterior) ou **🚨 Reincidência Crítica (2+)**. |
| **🏥 Triagem de Atestados** (`/atestados`) | Envio mobile-first pelo aluno com anexo simulado e bancada de triagem para a secretaria/coordenação. | **Abono em Cascata:** ao deferir o atestado, o sistema converte automaticamente as faltas daquelas datas para *"Falta Justificada"* no diário. |
| **👤 Prontuário 360° do Aluno** (`/alunos`) | Painel unificado com filtros por turma, busca rápida e prontuário completo do estudante em 3 abas. | Reúne frequência, minutos de atrasos acumulados, reincidências e atestados em um único lugar. |

---

## 🎭 3. Guia de Demonstração para a Banca Avaliadora

O projeto conta com um **Alternador de Perfis Demo em 1 Clique (Topbar)** para que os avaliadores possam testar todos os ângulos da aplicação instantaneamente:

```
[ Topbar Superior Direito ] ➔ Clique no Cartão do Usuário Conectado ➔ Escolha o Perfil:
```

1. **👨‍🏫 Professor — Prof. Carlos Mendes (`carlos@demo.com`)**
   - Acesse **Frequência / Chamada** e faça a chamada da turma em 2 toques.
   - Registre atrasos com tolerância em minutos para os alunos.
   - Visualize a turma ativa e os desvios disciplinares da oficina.

2. **👮‍♀️ Apoio / Inspetoria — Mariana Silva (`mariana@demo.com`)**
   - Acesse **Ocorrências & Uniforme** e lance uma nova advertência de vestimenta.
   - Veja o **Cálculo Inteligente de Reincidência** atuar em tempo real ao selecionar os estudantes.
   - Realize a triagem de atestados na bancada da secretaria.

3. **🎓 Aluno — Lucas da Silva (`aluno@demo.com` • Turma: DS-2026-01)**
   - Acesse **Minha Frequência** para consultar seu índice de assiduidade (% de presença) sem poder editar.
   - Acesse **Minhas Ocorrências** para ver o extrato de transparência disciplinar.
   - Acesse **Atestados** para submeter um novo atestado com comprovante simulado.

4. **🏛️ Administrador — Coordenação Geral (`admin@demo.com`)**
   - Acesse **Alunos** para consultar a listagem geral de turmas e abrir a **Ficha Completa 360°** de qualquer aluno.
   - Deferir atestados pendentes e verificar o reflexo imediato no diário de classe.

---

## 🛠️ 4. Stack Tecnológica

- **Framework:** [Next.js 15+](https://nextjs.org/) com App Router e Turbopack
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estrita para segurança de dados)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Design responsivo corporativo e moderno)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Gerenciamento de Estado & Persistência:** Context API reativa com persistência no `localStorage` do navegador (sem necessidade de banco externo para apresentação demonstrativa).

---

## 💻 5. Como Executar Localmente

Caso deseje rodar a aplicação em ambiente de desenvolvimento local:

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Acesse a pasta do projeto
cd matheus117_facilata_senai

# 3. Instale as dependências
npm install

# 4. Inicie o servidor local
npm run dev
```

Abra no navegador em: **[http://localhost:3000](http://localhost:3000)**.

---

## ⚖️ 6. Aviso Institucional & Acadêmico

> **Aviso:** Todos os dados de alunos, turmas, ocorrências, matrículas e regras disciplinares apresentados neste sistema são **fictícios**, estruturados exclusivamente para fins de validação conceitual, arquitetural e demonstração acadêmica do projeto **Facilita SENAI / EduFlow** no SENAI Vila Leopoldina.
