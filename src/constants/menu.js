const data = [
  {
    id:"inicio",
    icon:"simple-icon-home",
    label:"inicio",
    to:"/app/inicio",
  },
  {
    id: "informes",
    icon: "simple-icon-doc",
    label: "Nuevo Informe",
    to: "/app/informes",
    action: true
  },
  {
    id: "clientes",
    icon: "simple-icon-people",
    label: "Clientes",
    to: "/app/clientes",
    subs: [{
        icon: "iconsminds-business-mens",
        label: "Ver clientes",
        to: "/app/clientes"
      },
      {
        icon: "iconsminds-add-user",
        label: "Nuevo cliente",
        to: "/app/clientes/alta-cliente"
      },
    ]
  },
  {
    id: "servicios",
    icon: "iconsminds-suitcase",
    label: "Servicios",
    to: "/app/servicios",
  },
  {
    id: "usuarios",
    icon: "simple-icon-user",
    label: "Usuarios",
    to: "/app/usuarios",
  },
];
export default data;