import { test, expect } from "@playwright/test";
async function select(page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "J’en ai marre.", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "La boucle" }).click();
  await page.getByRole("button", { name: "Sens", exact: true }).click();
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
  await expect(
    page.getByRole("link", { name: "Explorer ce récit" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Affiner mes choix" }).click();
  await expect(page.getByRole("button", { name: "La boucle" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
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

test("three reflective invitations offer private optional writing without changing the match", async ({
  page,
}) => {
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
  await expect(page.locator(".discovery-summary p")).toHaveCount(2);
  await expect(page.locator(".reflection-questions li")).toHaveCount(3);
  await expect(
    page.locator(".reflection-questions textarea").first(),
  ).toBeHidden();
  const link = page.getByRole("link", { name: "Explorer ce récit" });
  const original = await link.getAttribute("href");
  await page.locator(".reflection-writing summary").first().click();
  const notes = page.locator(".reflection-questions textarea").first();
  await notes.fill("PRIVATE_MY_RESOURCES");
  await expect(notes).toHaveValue("PRIVATE_MY_RESOURCES");
  await expect(link).toHaveAttribute("href", original);
  await expect(page.locator("#myth-title")).toHaveText("Sisyphe");
  await page.screenshot({
    path: "/tmp/marremythe-enriched-story.png",
    fullPage: true,
  });
  const alternate = page.getByRole("button", {
    name: "Découvrir une autre résonance",
  });
  if (await alternate.count()) {
    await alternate.click();
    await expect(page.locator(".reflection-questions li")).toHaveCount(3);
    await expect(
      page.locator(".reflection-questions textarea").first(),
    ).toHaveValue("");
  }
  await page.getByRole("button", { name: "Recommencer", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "J’en ai marre.", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".reflection")).toHaveCount(0);
});
