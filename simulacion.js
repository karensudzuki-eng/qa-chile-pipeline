const { chromium } = require('playwright');

(async () => {
  // Captura la URL que le envíe Docker o n8n. Si no hay ninguna, usa SauceDemo por defecto.
  const targetUrl = process.env.TARGET_URL || 'https://saucedemo.com';
  
  console.log(`[QA CHILE] Iniciando simulación de carga en: ${targetUrl}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navegar al sitio
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    console.log(`[QA CHILE] Pagina cargada exitosamente.`);

    // 2. Flujo de prueba (Ejemplo con login de SauceDemo)
    if (targetUrl.includes('saucedemo.com')) {
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await page.waitForSelector('.inventory_list', { timeout: 5000 });
      console.log(`[QA CHILE] Éxito: Flujo completo completado sin errores.`);
    } else {
      // Si es la web de un cliente, solo valida que cargó el Home correctamente
      console.log(`[QA CHILE] Éxito: El sitio del cliente respondió correctamente.`);
    }

  } catch (error) {
    console.error(`[QA CHILE] ❌ ERROR EN LA PRUEBA: ${error.message}`);
    process.exit(1); // Avisa a Docker que la prueba falló
  } finally {
    await browser.close();
  }
})();
