import { afterEach, describe, expect, it, vi } from "vitest";

const mockChannel = {
  on: vi.fn(),
  subscribe: vi.fn(),
  track: vi.fn(),
  unsubscribe: vi.fn(),
  presenceState: vi.fn(() => ({})),
};
mockChannel.on.mockReturnValue(mockChannel);

const mockClient = { channel: vi.fn(() => mockChannel) };

vi.mock("@supabase/realtime-js", () => ({
  RealtimeClient: vi.fn(function RealtimeClientMock() {
    return mockClient;
  }),
}));

vi.mock("@/lib/config/env", () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: undefined as string | undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined as string | undefined,
  },
}));

const envModule = await import("@/lib/config/env");
const env = envModule.env as { NEXT_PUBLIC_SUPABASE_URL?: string; NEXT_PUBLIC_SUPABASE_ANON_KEY?: string };
const { SupabasePresenceProvider } = await import("./supabase-presence-provider");

describe("SupabasePresenceProvider", () => {
  afterEach(() => {
    vi.clearAllMocks();
    env.NEXT_PUBLIC_SUPABASE_URL = undefined;
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY = undefined;
  });

  it("sin credenciales de Supabase, no revienta: no llama a onCountChange y devuelve un no-op", () => {
    const onCountChange = vi.fn();
    const provider = new SupabasePresenceProvider();

    const leave = provider.joinChannel("mapa-predio", onCountChange);

    expect(onCountChange).not.toHaveBeenCalled();
    expect(() => leave()).not.toThrow();
  });

  it("con credenciales, se une al canal y notifica el conteo cuando sincroniza presencia", () => {
    env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    mockChannel.presenceState.mockReturnValue({ a: [{}], b: [{}] });

    const onCountChange = vi.fn();
    const provider = new SupabasePresenceProvider();
    provider.joinChannel("mapa-predio", onCountChange);

    expect(mockClient.channel).toHaveBeenCalledWith(
      "mapa-predio",
      expect.objectContaining({ config: expect.objectContaining({ presence: expect.any(Object) }) }),
    );

    // Simula el callback de sync que el SDK real dispara.
    const syncCallback = mockChannel.on.mock.calls.find(([event]) => event === "presence")?.[2];
    syncCallback?.();

    expect(onCountChange).toHaveBeenCalledWith(2);
  });

  it("la función de limpieza cancela la suscripción del canal", () => {
    env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    const provider = new SupabasePresenceProvider();
    const leave = provider.joinChannel("mapa-predio", vi.fn());
    leave();

    expect(mockChannel.unsubscribe).toHaveBeenCalled();
  });
});
