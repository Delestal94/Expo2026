import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShareLocationButton } from "./share-location-button";

const PROPS = {
  url: "https://maps.app.goo.gl/example",
  title: "ExpoJuy 2026",
  text: "Así se llega",
  label: "Compartir ubicación",
};

describe("ShareLocationButton", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("no se renderiza cuando el navegador no soporta la Web Share API", async () => {
    vi.stubGlobal("navigator", { ...navigator, share: undefined });
    render(<ShareLocationButton {...PROPS} />);
    await act(async () => {});

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("invoca navigator.share con la ubicación cuando el navegador la soporta", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, share });
    render(<ShareLocationButton {...PROPS} />);

    const button = await screen.findByRole("button", { name: PROPS.label });
    fireEvent.click(button);

    await waitFor(() =>
      expect(share).toHaveBeenCalledWith({
        title: PROPS.title,
        text: PROPS.text,
        url: PROPS.url,
      }),
    );
  });
});
