import { test, expect } from "@playwright/test";
async function choose(page, label = "Tout porter") {
  await page.goto("/");
  await page.getByRole("button", { name: "Je jette mes colères !" }).click();
  await expect(page.locator("fieldset")).toHaveCount(1);
  await page.getByRole("button", { name: label, exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Je les jette" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Je les jette" }).click();
}
async function throwWithKeyboard(page) {
  for (const ingredient of await page.locator(".ingredient").all()) {
    await ingredient.focus();
    await page.keyboard.press("Enter");
    await expect(ingredient).toBeDisabled();
  }
  await expect(page.locator("#myth-title")).toBeVisible();
}
async function reveal(page, label) {
  await choose(page, label);
  await throwWithKeyboard(page);
}

test("dragging anger reveals one value directly, without selecting a value or mixing", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await choose(page);
  await page.locator(".ingredient").click();
  await expect(page.locator("#myth-title")).toHaveCount(0);
  const ingredient = await page.locator(".ingredient").boundingBox(),
    pot = await page.locator(".cauldron").boundingBox();
  await page.mouse.move(
    ingredient.x + ingredient.width / 2,
    ingredient.y + ingredient.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(pot.x + pot.width / 2, pot.y + 55, { steps: 12 });
  await page.mouse.up();
  await expect(page.locator("#myth-title")).toHaveText("Solidarité");
  await expect(page.locator(".value-orb")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: /Mélanger|Activer le secouement/ }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Mon bouillon (0)", exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Oui, je la garde" }).click();
  await expect(page.locator(".value-feedback")).toContainText(
    "Cette valeur est dans ton bouillon",
  );
  expect(errors).toEqual([]);
});

test("accepted values survive reload, deduplicate across anger sessions and can be removed", async ({
  page,
}) => {
  await reveal(page);
  await page.getByRole("button", { name: "Oui, je la garde" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("marremythe.resource-bubbles.v1"))
            .ids,
      ),
    )
    .toEqual(["value:1"]);
  await page.getByRole("button", { name: "Jeter d’autres colères" }).click();
  await page.getByRole("button", { name: "Tout porter", exact: true }).click();
  await page.getByRole("button", { name: "Je les jette" }).click();
  await throwWithKeyboard(page);
  await page.getByRole("button", { name: "Oui, elle me ressemble" }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Mon bouillon (1)", exact: false })
    .click();
  await expect(page.locator(".collection-card")).toHaveCount(1);
  await page.locator(".collection-card").click();
  await expect(
    page.getByRole("heading", { name: "Solidarité", exact: true }),
  ).toBeVisible();
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

test("declining does not save; another aroma is a suggestion, not a value-selection screen", async ({
  page,
}) => {
  await reveal(page, "Toujours pareil");
  await expect(page.locator("#myth-title")).toHaveText("Sens");
  await page.getByRole("button", { name: "Non, je la laisse" }).click();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("marremythe.resource-bubbles.v1"),
    ),
  ).toBeNull();
  await page.getByRole("button", { name: "Essayer un autre arôme" }).click();
  await expect(page.locator("#myth-title")).toHaveText("Renouveau");
  await expect(page.locator("#myth-title")).toBeFocused();
  await page.getByRole("button", { name: "Oui, je la garde" }).click();
  await expect(
    page.getByRole("button", { name: "Mon bouillon (1)", exact: false }),
  ).toBeVisible();
});

test("free-form anger stays private and the general suggestion is explicit", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Je jette mes colères !" }).click();
  await page.getByRole("button", { name: "Autre", exact: true }).click();
  await page.getByRole("textbox").fill("PRIVATE_ANGER");
  await page.getByRole("button", { name: "Je les jette" }).click();
  await throwWithKeyboard(page);
  await expect(page.locator(".value-hypothesis")).toContainText(
    "On ne devine pas",
  );
  await page.getByRole("button", { name: "Oui, je la garde" }).click();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("marremythe.resource-bubbles.v1"),
    ),
  ).not.toContain("PRIVATE");
});

test("keyboard and reduced motion complete the shortened flow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await reveal(page, "Ne pas compter");
  await expect(page.locator("#myth-title")).toHaveText("Reconnaissance");
  await expect(page.locator(".particles")).toBeHidden();
  expect(
    await page
      .locator(".value-orb")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.getByRole("button", { name: "Oui, je la garde" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Mon bouillon (1)", exact: false }),
  ).toBeVisible();
});

test("mobile touch drag reveals an aroma with both decision buttons reachable", async ({
  browser,
}) => {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await page.goto("http://127.0.0.1:4180");
  await choose(page);
  const session = await page.context().newCDPSession(page);
  const box = await page.locator(".ingredient").boundingBox(),
    pot = await page.locator(".cauldron").boundingBox();
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    end = { x: pot.x + pot.width / 2, y: pot.y + 55 };
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [start],
  });
  for (let i = 1; i <= 12; i++)
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: start.x + ((end.x - start.x) * i) / 12,
          y: start.y + ((end.y - start.y) * i) / 12,
        },
      ],
    });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator("#myth-title")).toHaveText("Solidarité");
  await expect(
    page.getByRole("button", { name: "Oui, je la garde" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Non, je la laisse" }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "/tmp/marmythe-single-value-mobile.png",
    fullPage: true,
  });
  await session.detach();
  await page.close();
});

test("old bubbles remain accessible without being counted as accepted values", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "marremythe.resource-bubbles.v1",
      JSON.stringify({ version: 1, ids: ["sisyphe:idea", "value:1"] }),
    ),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Mon bouillon (1)", exact: false })
    .click();
  await expect(
    page.locator(".collection-card").filter({ visible: true }),
  ).toHaveCount(1);
  await page.getByText("Mes anciennes bulles (1)", { exact: true }).click();
  await expect(
    page.locator(".collection-card").filter({ visible: true }),
  ).toHaveCount(2);
  await page.getByRole("button", { name: "Une idée", exact: false }).click();
  await expect(page.locator(".bubble-reader")).toBeVisible();
});

test("blocked storage keeps accepted values during the session", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await reveal(page);
  await page.getByRole("button", { name: "Oui, je la garde" }).click();
  await expect(
    page.getByText("Ton navigateur ne peut pas enregistrer le bouillon.", {
      exact: false,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mon bouillon (1)", exact: false })
    .click();
  await expect(page.locator(".collection-card")).toHaveCount(1);
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

test("reading keeps particles paused through nested collection dialogs and resumes afterwards", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__particleFrames = 0;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.classList.contains("particles"))
        window.__particleFrames++;
      return clear.apply(this, args);
    };
    localStorage.setItem(
      "marremythe.resource-bubbles.v1",
      JSON.stringify({ version: 1, ids: ["value:1"] }),
    );
  });
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => window.__particleFrames))
    .toBeGreaterThan(2);
  await page
    .getByRole("button", { name: "Mon bouillon (1)", exact: false })
    .click();
  const paused = await page.evaluate(() => window.__particleFrames);
  await page.locator(".collection-card").click();
  await page.getByRole("button", { name: "Fermer", exact: true }).click();
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => window.__particleFrames)).toBe(paused);
  await page.getByRole("button", { name: "Fermer mon bouillon" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__particleFrames))
    .toBeGreaterThan(paused + 2);
});
