import { useCallback, useState } from "react";

const CONCURRENCIA = 3;

// Se pide una sola vez por carga de la app y se reutiliza
let configPromise = null;

const getConfig = () => {
  if (!configPromise) {
    configPromise = fetch("/api/config-whatsapp.php", {
      credentials: "same-origin", // cookie de sesión PHP
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`No se pudo cargar la configuración (${res.status})`);
        const { url, apiKey } = await res.json();
        if (!url || !apiKey) throw new Error("Configuración de WhatsApp incompleta");
        return { url, headers: { "Content-Type": "application/json", "X-API-Key": apiKey } };
      })
      .catch((error) => {
        configPromise = null; // permite reintentar si falló
        throw error;
      });
  }
  return configPromise;
};

const getSessionId = async ({ url, headers }) => {
  const res = await fetch(`${url}/api/sessions`, { headers });
  if (!res.ok) throw new Error("Error al obtener el sessionId");
  const data = await res.json();
  if (!data?.[0]?.id) throw new Error("No hay sesión de WhatsApp activa");
  return data[0].id;
};

const enviarTexto = async ({ url, headers }, sessionId, telefono, text) => {
  const res = await fetch(`${url}/api/sessions/${sessionId}/messages/send-text`, {
    method: "POST",
    headers,
    body: JSON.stringify({ chatId: `${telefono}@c.us`, text }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} enviando a ${telefono}`);
};

// Pool simple: ejecuta `worker` sobre `items` con máximo `limite` en vuelo
const conConcurrencia = async (items, limite, worker) => {
  const resultados = new Array(items.length);
  let siguiente = 0;

  const corredores = Array.from(
    { length: Math.min(limite, items.length) },
    async () => {
      while (siguiente < items.length) {
        const i = siguiente++;
        try {
          resultados[i] = { ok: true, value: await worker(items[i]) };
        } catch (error) {
          resultados[i] = { ok: false, error };
        }
      }
    },
  );

  await Promise.all(corredores);
  return resultados;
};

export const useWhatsappNotification = () => {
  const [enviandoNotificacion, setEnviandoNotificacion] = useState(false);

  /**
   * Envía `texto` a cada teléfono. No muestra toasts: devuelve el resultado.
   * @returns {Promise<{ enviados: number, fallidos: string[] }>}
   * Lanza error solo si falla la config o la sesión (falla total).
   */
  const enviarMensajes = useCallback(async (telefonos, texto) => {
    setEnviandoNotificacion(true);
    try {
      const config = await getConfig();
      const sessionId = await getSessionId(config); // una sola vez
      const resultados = await conConcurrencia(telefonos, CONCURRENCIA, (t) =>
        enviarTexto(config, sessionId, t, texto),
      );

      const fallidos = telefonos.filter((_, i) => !resultados[i].ok);
      return { enviados: telefonos.length - fallidos.length, fallidos };
    } finally {
      setEnviandoNotificacion(false);
    }
  }, []);

  return { enviandoNotificacion, enviarMensajes };
};