import { test, expect } from '@playwright/test';

test.describe('TaskFlow App', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should add a task and display it', async ({ page }) => {
        // Ajouter une tâche
        await page.fill('input[type="text"]', 'Acheter du pain');
        await page.click('button[type="submit"]');

        // Vérifier qu'elle apparaît
        await expect(page.locator('text=Acheter du pain')).toBeVisible();
    });

    test('should toggle a task as completed', async ({ page }) => {
        // Ajouter une tâche
        await page.fill('input[type="text"]', 'Tâche à cocher');
        await page.click('button[type="submit"]');

        // Cocher la tâche
        await page.click('input[type="checkbox"]');

        // Vérifier qu'elle est cochée
        await expect(page.locator('input[type="checkbox"]')).toBeChecked();
    });

    test('should delete a task', async ({ page }) => {
        // Ajouter une tâche
        await page.fill('input[type="text"]', 'Tâche à supprimer');
        await page.click('button[type="submit"]');

        // Supprimer la tâche
        await page.click('button.delete, button[aria-label="Delete"]');

        // Vérifier qu'elle a disparu
        await expect(page.locator('text=Tâche à supprimer')).not.toBeVisible();
    });
});
