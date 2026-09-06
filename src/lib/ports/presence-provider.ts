/**
 * Puerto para "cuánta gente está viendo esto ahora" en tiempo real (ver
 * ADR-0002 e issue #10). El código de negocio depende solo de esta
 * interfaz — nunca del SDK concreto de Supabase Realtime, Pusher, Ably,
 * etc. — para poder cambiar de proveedor cambiando un adaptador y una
 * variable de entorno (REALTIME_PROVIDER).
 */
export interface PresenceProvider {
  /**
   * Se une a un canal de presencia y llama a `onCountChange` cada vez que
   * cambia la cantidad de clientes conectados (incluyéndose a sí mismo).
   * Devuelve una función de limpieza que hay que llamar al desmontar.
   */
  joinChannel(channelName: string, onCountChange: (count: number) => void): () => void;
}
