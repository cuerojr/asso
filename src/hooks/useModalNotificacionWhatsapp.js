import { useCallback, useEffect, useRef, useState } from "react";
import { useWhatsappNotification } from "./useWhatsappNotification";
import { NotificationManager } from "../components/common/react-notifications";

const MENSAJE_DEFAULT =
  "Hola! Tenemos novedades para vos en ASSO. Ingresá a tu cuenta para verlas.";

const limpiarTelefono = (valor = "") => String(valor ?? "").replace(/\D/g, "");

// Argentina: deja el número como 549 + área + número (sin 0 ni 15)
const normalizarTelefono = (valor = "") => {
  let tel = limpiarTelefono(valor).replace(/^0+/, "");
  if (tel.startsWith("549")) return tel;
  if (tel.startsWith("54")) return `549${tel.slice(2)}`;
  return `549${tel}`;
};

const telefonoValido = (tel) => tel.length >= 12 && tel.length <= 15;

export const useModalNotificacionWhatsapp = ({
  email = "",
  abierto = false,
  usuarios = [], // [{ id, nombre, telefono }]
  mensaje = MENSAJE_DEFAULT,
  onCerrar,
  onEnviado,
} = {}) => {
  const { enviarMensajes } = useWhatsappNotification();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [enviando, setEnviando] = useState(false);

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

  // Junta teléfonos de usuarios tildados + número manual, normalizados y sin duplicados
  const validar = useCallback(() => {
    const telefonos = new Set();

    usuarios
      .filter((u) => usuariosSeleccionados.includes(u.id))
      .forEach((u) => telefonos.add(normalizarTelefono(u.telefono)));

    if (limpiarTelefono(phoneNumber)) {
      telefonos.add(normalizarTelefono(phoneNumber));
    }

    const lista = [...telefonos];

    if (lista.length === 0) {
      NotificationManager.warning(
        "Ingresá un celular o seleccioná al menos un usuario",
      );
      return null;
    }

    if (!lista.every(telefonoValido)) {
      NotificationManager.warning("Hay un número de celular inválido");
      return null;
    }

    return lista;
  }, [phoneNumber, usuarios, usuariosSeleccionados]);

  const enviar = useCallback(async () => {
    if (enviando) return;

    const telefonos = validar();
    if (!telefonos) return;

    setEnviando(true);
    try {
      const { enviados, fallidos } = await enviarMensajes(telefonos, mensaje);

      if (fallidos.length === 0) {
        NotificationManager.success("Notificaciones enviadas por WhatsApp");
        onEnviado?.();
        cerrar();
      } else if (enviados === 0) {
        NotificationManager.error("No se pudo enviar la notificación");
      } else {
        NotificationManager.warning(
          `Se enviaron ${enviados} de ${telefonos.length}. Fallaron: ${fallidos.join(", ")}`,
        );
      }
    } catch (error) {
      console.error("Error al enviar notificaciones:", error);
      NotificationManager.error("No se pudo conectar con WhatsApp");
    } finally {
      if (montado.current) setEnviando(false);
    }
  }, [enviando, validar, enviarMensajes, mensaje, onEnviado, cerrar]);

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