// hooks/useWhatsappMessages.js
import { useCallback, useMemo } from "react";

const ASSO_PHONE = "0341 491-5887";
const ASSO_EMAIL = "info@assoconsultores.ar";
export const PORTAL_URL = "https://clientes.assoconsultores.ar";

export function useWhatsappMessages() {
  // Mensaje que se envía por WhatsApp al guardar el número
  const welcomeMessage = useMemo(
    () =>
      `Hola! Has guardado correctamente tu nro de whatsapp para recibir notificaciones de ASSO directo a tu celular. Agendá este número y recordá que este chat no es para conversar con nosotros, sólo lo usamos para enviar notificaciones.\n` +
      `Para comunicarte con el equipo de ASSO, podés hacerlo al número: ${ASSO_PHONE} o por email a ${ASSO_EMAIL}`,
    [],
  );

  // Mensaje que se envía por WhatsApp cuando hay un nuevo informe
  const getNewReportMessage = useCallback(
    ({ titulo, url = PORTAL_URL } = {}) =>
      `Hola! Tenemos novedades para vos en ASSO.\n` +
      (titulo
        ? `Ya está disponible un nuevo informe: ${titulo}.\n`
        : `Ya está disponible un nuevo informe.\n`) +
      `Podés verlo ingresando a ${url}\n` +
      `Recordá que este chat es solo para notificaciones. Para consultas: ${ASSO_PHONE} o ${ASSO_EMAIL}`,
    [],
  );

  // Mensaje del modal cuando el usuario guarda su número
  const getAcceptedModalMessage = useCallback(
    (phone) =>
      `¡Listo! Recibirás notificaciones a tu WhatsApp cuando tengamos novedades para vos.\n` +
      `Te hemos enviado un mensaje para corroborar tu número: ${phone}\n` +
      `Si no lo has recibido, podés revisar el número desde la configuración de tu cuenta.`,
    [],
  );

  // Mensaje del modal cuando el usuario elige "no por ahora"
  const declinedModalMessage = useMemo(
    () =>
      "¡Ok! No hay problema. Podés guardar tu nro de WhatsApp en cualquier momento desde la configuración de tu cuenta.",
    [],
  );

  return {
    welcomeMessage,
    getNewReportMessage,
    getAcceptedModalMessage,
    declinedModalMessage,
  };
}