import { test, expect } from "@playwright/test";
async function select(page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "J’en ai marre.", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Toujours pareil" }).click();
  await page
    .getByRole("button", { name: "Savoir pourquoi", exact: true })
    .click();
  await page.getByRole("button", { name: "À la marmite" }).click();
}
async function dropAll(page, touch = false) {
  const buttons = page.locator(".ingredient");
  const total = await buttons.count();
  const session = touch ? await page.context().newCDPSession(page) : null;
  for (let i = 0; i < total; i++) {
    const box = await buttons.nth(i).boundingBox(),
      pot = await page.locator(".cauldron").boundingBox();
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 },
      end = { x: pot.x + pot.width / 2, y: pot.y + 55 };
    if (touch) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [start],
      });
      for (let j = 1; j <= 12; j++)
        await session.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [
            {
              x: start.x + ((end.x - start.x) * j) / 12,
              y: start.y + ((end.y - start.y) * j) / 12,
            },
          ],
        });
      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    } else {
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      await page.mouse.move(end.x, end.y, { steps: 12 });
      await page.mouse.up();
    }
    await expect(buttons.nth(i)).toBeDisabled();
  }
  await session?.detach();
}
async function sensor(page, x) {
  await page.evaluate((x) => {
    const event = new Event("devicemotion");
    event.acceleration = { x, y: 0, z: 0 };
    window.dispatchEvent(event);
  }, x);
}

test("desktop: real drag/drop, no click-to-drop, mixing and automatic discovery", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await select(page);
  await page.locator(".ingredient").first().click();
  await expect(page.locator(".ingredient").first()).toBeEnabled();
  const start = await page.locator(".ingredient").first().boundingBox();
  await page.mouse.move(start.x + 20, start.y + 20);
  await page.mouse.down();
  await page.mouse.move(start.x + 40, start.y + 40);
  await page.mouse.up();
  await expect(page.locator(".ingredient").first()).toBeEnabled();
  await dropAll(page);
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Mélanger", exact: false }).click();
  await expect(page.locator("#myth-title")).toHaveText("Sisyphe");
  await page
    .getByRole("button", { name: "Ouvrir : L’histoire", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "En savoir plus sur cette histoire" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Laisser cette bulle" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Changer mes choix" }).click();
  await expect(
    page.getByRole("button", { name: "Toujours pareil" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});

test("keyboard and reduced motion retain the entire flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await select(page);
  for (const button of await page.locator(".ingredient").all()) {
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toBeDisabled();
  }
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "Mélanger", exact: false }).focus();
    await page.keyboard.press("Enter");
  }
  await expect(page.locator("#myth-title")).toBeVisible();
  await expect(page.locator(".particles")).toBeHidden();
});

test("original retro soundtrack starts on demand and really suspends when muted", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    window.AudioContext = function (...args) {
      const context = new Original(...args);
      window.__audio = context;
      window.__notes = 0;
      const create = context.createOscillator.bind(context);
      context.createOscillator = () => {
        window.__notes++;
        return create();
      };
      return context;
    };
  });
  await page.goto("/");
  expect(await page.evaluate(() => window.__audio)).toBeUndefined();
  await page.getByRole("button", { name: "Activer la musique rétro" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__audio.state))
    .toBe("running");
  await expect
    .poll(() => page.evaluate(() => window.__notes))
    .toBeGreaterThan(12);
  await page.getByRole("button", { name: "Couper la musique" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__audio.state))
    .toBe("suspended");
});

test.describe("smartphone", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  test("touch drag/drop and permitted simulated physical shakes complete the mix", async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      window.DeviceMotionEvent.requestPermission = async () => "granted";
    });
    await select(page);
    await dropAll(page, true);
    await page.screenshot({
      path: "/tmp/marremythe-playful-pot.png",
      fullPage: true,
    });
    await expect(
      page.getByText("Secoue ton tel !", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Activer le secouement" }).click();
    await sensor(page, 0);
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(260);
      await sensor(page, i % 2 ? -20 : 20);
    }
    await expect(page.locator("#myth-title")).toHaveText("Sisyphe");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "/tmp/marremythe-playful-mobile.png",
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
  test("denied sensors keep a working fallback", async ({ page }) => {
    await page.addInitScript(() => {
      window.DeviceMotionEvent.requestPermission = async () => "denied";
    });
    await select(page);
    await dropAll(page, true);
    await page.getByRole("button", { name: "Activer le secouement" }).click();
    await expect(
      page.getByText("Accès refusé.", { exact: false }),
    ).toBeVisible();
    for (let i = 0; i < 5; i++)
      await page.getByRole("button", { name: "Mélanger sans secouer" }).click();
    await expect(page.locator("#myth-title")).toBeVisible();
  });
  test("seven ingredients fit on mobile and unsupported motion remains usable", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.DeviceMotionEvent = undefined;
    });
    await page.goto("/");
    for (const index of [0, 1, 2])
      await page
        .locator("fieldset")
        .nth(0)
        .getByRole("button")
        .nth(index)
        .click();
    for (const index of [0, 1])
      await page
        .locator("fieldset")
        .nth(1)
        .getByRole("button")
        .nth(index)
        .click();
    await page.locator(".optional-emotions summary").click();
    for (const index of [0, 1])
      await page
        .locator("fieldset")
        .nth(2)
        .getByRole("button")
        .nth(index)
        .click();
    await page.getByRole("button", { name: "À la marmite" }).click();
    await expect(page.locator(".ingredient")).toHaveCount(7);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await dropAll(page, true);
    await page.getByRole("button", { name: "Activer le secouement" }).click();
    await expect(
      page.getByText("Ce navigateur ne propose pas les capteurs.", {
        exact: false,
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Mélanger sans secouer" }).click();
    await expect(page.getByRole("progressbar")).toHaveAttribute("value", "20");
  });
  test("silent sensors explain the fallback", async ({ page }) => {
    await page.addInitScript(() => {
      window.DeviceMotionEvent.requestPermission = async () => "granted";
    });
    await select(page);
    await dropAll(page, true);
    await page.getByRole("button", { name: "Activer le secouement" }).click();
    await expect(
      page.getByText("Aucun mouvement reçu.", { exact: false }),
    ).toBeVisible({ timeout: 7000 });
    await page.getByRole("button", { name: "Mélanger sans secouer" }).click();
    await expect(page.getByRole("progressbar")).toHaveAttribute("value", "20");
  });
});

async function reveal(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await select(page);
  for (const button of await page.locator(".ingredient").all()) {
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toBeDisabled();
  }
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Mélanger", exact: false }).click();
  await expect(page.locator("#myth-title")).toHaveText("Sisyphe");
}

test("six bubbles open individually, closing asks for a choice and restores keyboard focus", async ({
  page,
}) => {
  await reveal(page);
  await expect(page.locator(".revelation-bubble")).toHaveCount(6);
  const opener = page.getByRole("button", {
    name: "Ouvrir : L’histoire",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".bubble-text")).toHaveCount(2);
  await expect(
    dialog.getByRole("link", { name: "En savoir plus sur cette histoire" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("status")).toContainText("Tu la gardes");
  await dialog.getByRole("button", { name: "Laisser cette bulle" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(opener).toBeFocused();
  await page
    .getByRole("button", { name: "Ouvrir : Ce qui peut aider", exact: true })
    .click();
  await expect(page.getByRole("dialog").locator(".bubble-text")).toHaveCount(2);
  await page.getByRole("button", { name: "Garder dans mon bouillon" }).click();
  await expect(
    page.getByRole("button", { name: "Mon bouillon (1)", exact: false }),
  ).toBeVisible();
});

test("kept bubbles survive a reload, do not duplicate, and can be reopened and removed", async ({
  page,
}) => {
  await reveal(page);
  await page
    .getByRole("button", { name: "Ouvrir : Une idée à garder", exact: true })
    .click();
  await page.getByRole("button", { name: "Garder dans mon bouillon" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("marremythe.resource-bubbles.v1"))
            .ids,
      ),
    )
    .toEqual(["sisyphe:idea"]);
  await page
    .getByRole("button", { name: "Ouvrir : Une idée à garder", exact: true })
    .click();
  await page.getByRole("button", { name: "Fermer", exact: true }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Mon bouillon (1)", exact: false })
    .click();
  await expect(page.locator(".collection-card")).toHaveCount(1);
  await page.locator(".collection-card").click();
  await expect(page.locator(".bubble-reader")).toBeVisible();
  await expect(page.locator(".bubble-reader .bubble-text")).toContainText(
    "Un petit changement",
  );
  await page.getByRole("button", { name: "Retirer de mon bouillon" }).click();
  await expect(page.locator(".collection-empty")).toBeVisible();
  await page.getByRole("button", { name: "Fermer mon bouillon" }).click();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Mon bouillon (0)", exact: false }),
  ).toBeVisible();
});

test("question notes stay temporary, are not stored with kept bubbles or included in searches", async ({
  page,
}) => {
  await reveal(page);
  await page
    .getByRole("button", { name: "Ouvrir : Ce qui te pèse", exact: true })
    .click();
  await page.locator(".reflection-writing summary").click();
  await page.getByRole("textbox").fill("PRIVATE_MY_RESOURCES");
  await page.getByRole("button", { name: "Garder dans mon bouillon" }).click();
  const stored = await page.evaluate(() =>
    localStorage.getItem("marremythe.resource-bubbles.v1"),
  );
  expect(stored).not.toContain("PRIVATE");
  await page
    .getByRole("button", { name: "Ouvrir : Ce qui te pèse", exact: true })
    .click();
  await page.locator(".reflection-writing summary").click();
  await expect(page.getByRole("textbox")).toHaveValue("PRIVATE_MY_RESOURCES");
  await page.getByRole("button", { name: "Fermer", exact: true }).click();
  await page
    .getByRole("button", { name: "Ouvrir : L’histoire", exact: true })
    .click();
  expect(
    await page
      .getByRole("link", { name: "En savoir plus sur cette histoire" })
      .getAttribute("href"),
  ).not.toContain("PRIVATE");
  await page.getByRole("button", { name: "Laisser cette bulle" }).click();
  await page.getByRole("button", { name: "Recommencer", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "J’en ai marre.", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Mon bouillon (1)", exact: false }),
  ).toBeVisible();
});

test("blocked storage still permits keeping bubbles for the current session", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await reveal(page);
  await page
    .getByRole("button", { name: "Ouvrir : Une idée à garder", exact: true })
    .click();
  await page.getByRole("button", { name: "Garder dans mon bouillon" }).click();
  await expect(page.locator(".collection-warning")).toBeVisible();
  await page
    .getByRole("button", { name: "Mon bouillon (1)", exact: false })
    .click();
  await expect(page.locator(".collection-card")).toHaveCount(1);
});

test("mobile fullscreen bubbles stay reachable and readable without horizontal overflow", async ({
  browser,
}) => {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await page.goto("http://127.0.0.1:4180");
  await reveal(page);
  await expect(page.locator(".revelation-bubble")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "/tmp/marremythe-bubble-world.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Ouvrir : Un petit pas", exact: true })
    .click();
  await expect(page.locator(".bubble-reader")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Garder dans mon bouillon" }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "Laisser cette bulle" }).click();
  await page.close();
});
