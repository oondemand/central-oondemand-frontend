import {
  Users,
  Settings,
  LogOut,
  ListChecks,
  CalendarSync,
  TicketCheckIcon,
  NotepadText,
  NotepadTextDashed,
  Notebook,
  Rotate3D,
  HelpCircle,
  MessageCircle,
  LifeBuoy,
} from "lucide-react";
import { Chart } from "../../svg/chart";
import { InvertedChart } from "../../svg/invertedChart";

export const menuItems = [
  {
    title: "Dashboard",
    icon: Chart,
    href: "/",
  },
  {
    title: "Planejamento",
    href: "/planejamento",
    icon: CalendarSync,
  },
  {
    title: "Documentos Fiscais",
    href: "/documentos-fiscais",
    icon: NotepadText,
    rules: ["admin", "tomador"],
  },
  {
    title: "Central Serviços Tomados",
    icon: InvertedChart,
    href: "/servicos-tomados",
  },
  {
    title: "Prestadores",
    icon: Users,
    href: "/pessoas",
  },
  {
    title: "Documentos Cadastrais",
    href: "/documentos-cadastrais",
    rules: ["admin", "tomador"],
  },
  {
    title: "Serviços",
    icon: ListChecks,
    href: "/servicos",
  },

  {
    title: "Integrações",
    icon: Rotate3D,
    rules: ["admin"],
    subLinks: [
      {
        title: "Prestador central -> omie",
        href: "/integracao/pessoa/central-omie",
      },
      {
        title: "Prestador omie -> central",
        href: "/integracao/pessoa/omie-central",
      },
      {
        title: "Conta pagar central -> omie",
        href: "/integracao/conta-pagar/central-omie",
      },
      {
        title: "Conta pagar omie -> central",
        href: "/integracao/conta-pagar/omie-central",
      },
      {
        title: "Anexos central -> omie",
        href: "/integracao/anexos/central-omie",
      },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    subLinks: [
      {
        title: "Listas",
        href: "/listas",
      },
      {
        title: "Moedas",
        href: "/moedas",
      },
      {
        title: "Registros",
        href: "/registros",
      },
      {
        title: "Sistema",
        href: "/sistema",
      },
      {
        title: "Etapas",
        href: "/etapas",
      },
      {
        title: "Assistentes",
        href: "/assistentes",
      },
      {
        title: "Integrações",
        href: "/configuracoes/integracao",
      },
    ],
  },
  {
    title: "Suporte",
    icon: LifeBuoy,
    subLinks: [
      {
        title: "Doc",
        href: "/doc",
      },
      {
        title: "Roteiro de testes",
        href: "/roteiro-de-testes",
      },
      {
        title: "Log de mudanças",
        href: "/changelog",
      },
    ],
  },
];
