import { useCallback, useEffect, useRef, useState } from "react";
import { useWhatsappNotification } from "./useWhatsappNotification";
import { NotificationManager } from "../components/common/react-notifications";

const limpiarTelefono = (valor = "") => valor.replace(/\D/g, "");

export const useModalNotificacionWhatsapp = ({
  email = "",
  abierto = false,
  usuarios = [], // [{ id, nombre, telefono }]
  onCerrar,
  onEnviado,
} = {}) => {
  const { notificarAlClienteViaWhatsapp } = useWhatsappNotification();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [enviando, setEnviando] = useState(false);

  /**
   * necesito ver si hay numero en la db para activar el modal, si no hay numero se activa el modal y se le pide al usuario que ingrese un numero de telefono, si hay numero en la db no se activa el modal.
   */

  // Evita setState si el componente se desmontó mientras se esperaba el fetch
  const montado = useRef(true);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  // Resetea el formulario cada vez que el modal se cierra
  useEffect(() => {
    if (!abierto) {
      setPhoneNumber("");
      setUsuariosSeleccionados([]);
      setEnviando(false);
    }
  }, [abierto]);

  const cerrar = useCallback(() => {
    onCerrar?.();
  }, [onCerrar]);

  const toggleUsuario = useCallback((id) => {
    setUsuariosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  }, []);

  // Junta los teléfonos de los usuarios tildados + el número manual (sin duplicados)
  const validar = useCallback(() => {
    const telefonos = new Set();

    usuarios
      .filter((u) => usuariosSeleccionados.includes(u.id))
      .forEach((u) => telefonos.add(limpiarTelefono(u.telefono)));

    const manual = limpiarTelefono(phoneNumber);
    if (manual) telefonos.add(manual);

    const lista = [...telefonos];

    if (lista.length === 0) {
      NotificationManager.warning(
        "Ingresá un celular o seleccioná al menos un usuario",
      );
      return null;
    }

    if (lista.some((t) => t.length < 10 || t.length > 15)) {
      NotificationManager.warning("Hay un número de celular inválido");
      return null;
    }

    return lista;
  }, [phoneNumber, usuarios, usuariosSeleccionados]);

  const enviar = useCallback(async () => {
    if (enviando) return;

    const telefonos = validar();
    if (!telefonos) return;

    try {
      setEnviando(true);

      const resultados = await Promise.allSettled(
        telefonos.map((telefono) =>
          notificarAlClienteViaWhatsapp({ phoneNumber: telefono }),
        ),
      );

      const fallidos = resultados.filter((r) => r.status === "rejected");

      if (fallidos.length === 0) {
        NotificationManager.success("Notificaciones enviadas por WhatsApp");
        onEnviado?.();
        cerrar();
      } else if (fallidos.length === telefonos.length) {
        console.error("Error al enviar notificaciones:", fallidos);
        NotificationManager.error("No se pudo enviar la notificación");
      } else {
        console.error("Envíos fallidos:", fallidos);
        NotificationManager.warning(
          `Se enviaron ${telefonos.length - fallidos.length} de ${telefonos.length} notificaciones`,
        );
      }
    } finally {
      if (montado.current) setEnviando(false);
    }
  }, [enviando, validar, notificarAlClienteViaWhatsapp, onEnviado, cerrar]);

  return {
    email,
    phoneNumber,
    setPhoneNumber,
    usuariosSeleccionados,
    toggleUsuario,
    enviando,
    enviar,
    cerrar,
  };
};