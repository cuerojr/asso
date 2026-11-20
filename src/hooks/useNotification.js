import { useState } from "react";

export const useNotificacion = (cargaMasiva) => {
  const [enviandoNotificacion, setEnviandoNotificacion] = useState(false);
  const [clienteNotificado, setClienteNotificado] = useState(false);
  const data1 =
    "owa_k1_3953e69318c07a4cf04bef61aa505e1f3b7dea4b841f9f3808a774e54c12ebe7";
  const data2 = "https://wa.rojodev.com.ar/";

  const volverAlInicio = (push) => {
    push("step1");
    setearCargaMasiva({
      tituloDeReferencia: "",
    });
  };

  const notificarAlCliente = () => {
    setEnviandoNotificacion(true);
    /*setTimeout(() => {
            setEnviandoNotificacion(false);
            setClienteNotificado(true);
        }, 10000);*/
    enviarNotificacionCliente(cargaMasiva.id).then((response) => {
      if (response.stat === 1) {
        setEnviandoNotificacion(false);
        setClienteNotificado(true);
      } else {
        NotificationManager.error(response.err, "Error");
      }
    });
  };

  const getSessionId = async () => {
    try {
      const response = await fetch(`${data2}/api/sessions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": data1,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener el sessionId");
      }
      const data = await response.json();
      return data[0].id;
    } catch (error) {
      console.error("Error al obtener el sessionId:", error);
      throw error;
    }
  };

  const notificarAlClienteViaWhatsapp = async (phoneNumber) => {
    try {
      // console.log("cargaMasiva", cargaMasiva);
      const numero = cargaMasiva.clienteSeleccionado?.telefono || phoneNumber;

      if (!numero) {
        NotificationManager.error(
          "No se pudo obtener el número de teléfono",
          "Error",
        );
        return;
      }

      const sessionId = await getSessionId();

      if (!sessionId) {
        NotificationManager.error("No se pudo obtener el sessionId", "Error");
        return;
      }

      const mensaje = `Estimado cliente \nLe informamos que la carga masiva de equipos ha sido finalizada.`;
      const res = await fetch(
        `${data2}/api/sessions/${sessionId}/messages/send-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": data1,
          },
          body: JSON.stringify({
            chatId: `${numero}@c.us`,
            text: mensaje,
          }),
        },
      );
      setEnviandoNotificacion(true);
      if (res.status === 201) {
        NotificationManager.success(
          "Notificación enviada correctamente",
          "Éxito",
        );
      } else {
        NotificationManager.error("Error al enviar la notificación", "Error");
      }
      setEnviandoNotificacion(false);
    } catch (error) {
      console.error("Error al enviar la notificación por WhatsApp:", error);
      NotificationManager.error(
        "Error al enviar la notificación por WhatsApp",
        "Error",
      );
    }
  };

  return {
    enviandoNotificacion,
    clienteNotificado,
    notificarAlCliente,
    notificarAlClienteViaWhatsapp,
    volverAlInicio,
  };
};