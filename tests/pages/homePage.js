import { log } from 'console';
import { expect } from 'playwright/test';

export class HomePage {
  /**
   * @param {import('playwright').Page} page
   */

  constructor(page, context) {
    this.page = page;
    this.context = context;
    this.parentPage = page;
    this.newPage = null;
    this.activePage = page; // default to parent page

    this.firmName_textLabel = page.getByRole('link', { name: 'Amazon.in' })
    this.searchBox_text = page.locator('#twotabsearchtextbox')
    this.cart_info = page.locator('#nav-cart-count')
    this.selectCategory_dropdown = page.getByTitle('Search in')
    this.selectSearchValue_dropdown = page.locator('#searchDropdownDescription')
    this.selectedSearchKey_dropdownText = page.locator('#nav-search-label-id')
    this.searchSummaryResults = page.locator('h2 span:has-text("results for")');
    this.sortBy_dropdown = page.locator('#s-result-sort-select')
    this.sortyBySelection_dropdownText = page.locator('.a-dropdown-prompt')
    this.itemsAfterSearch = page.locator('div[data-component-type="s-search-result"]')
    this.firstItemInSearch = page.locator('.s-product-image-container')
    this.addToCart_Button = page.getByRole('button', { name: 'Add to Cart', exact: true })
    this.buyNow_Button = page.getByRole('button', { name: 'Buy Now' })
    this.addToCratSuccessMsg_Text = page.getByRole('heading', { name: 'Added to cart' })
    this.proceedToCheckout_Button = page.getByRole('button', { name: 'Proceed to checkout (1 item)' })
    this.loginPageRedirect = page.locator('h1:has-text("Sign in or create account")');
  }

  async verifyFirmNameInSite() {
    await expect(this.firmName_textLabel).toBeVisible({ timeout: 3000 })
  }

  async verifySearchBarIsEmptyAndClickable() {
    await expect(this.cart_info).toBeVisible()
    await expect(this.searchBox_text).toHaveValue('')
    await this.searchBox_text.click()
  }

  async verifyCartCount(num) {
    await expect(this.activePage.locator('#nav-cart-count')).toBeVisible()
    await expect(this.activePage.locator('#nav-cart-count')).toHaveText(num)

    if (this.newPage && this.newPage !== this.parentPage) {
      await this.newPage.close();
      this.newPage = null;
      this.activePage = this.parentPage;
    }
  }

  async selectSearchCategory(searchCat) {
    console.log(searchCat)
    await this.selectCategory_dropdown.selectOption({ label: searchCat })
    await expect(this.selectedSearchKey_dropdownText).toHaveText(searchCat)
  }

  async searchItems(searchItem) {
    await this.searchBox_text.fill(searchItem)
    console.log(searchItem)
    await this.searchBox_text.press('Enter')
    await this.page.locator('h2 span', { hasText: searchItem }).first().waitFor({ state: 'visible' });
  }

  async getCurrentPageURL() {
    const currentPageTitle = this.activePage.url()
    console.log(currentPageTitle)
    return currentPageTitle
  }

  async getSearchSummaryText() {
    await this.searchSummaryResults.first().waitFor({ state: 'visible' });
    const summaryText = await this.searchSummaryResults.first().textContent();
    return summaryText.trim();
  }

  async sortByResultsBasedOnSelection(sortByCat) {
    console.log(sortByCat)
    await this.sortBy_dropdown.selectOption({ label: sortByCat })
  }

  async verifySortBySelection(sortByCat) {
    console.log(sortByCat)
    await expect(this.sortyBySelection_dropdownText).toHaveText(sortByCat)
  }

  async countItemsAndClickFisrtProductFromSearchResults(prodPlace) {
    const totalItemsCount = await this.itemsAfterSearch.count()
    console.log(totalItemsCount)
    const [newPageTemp] = await Promise.all([
      this.page.context().waitForEvent('page').catch(() => null),
      this.firstItemInSearch.nth(prodPlace).click(),
    ]);

    const isNewTab = !!newPageTemp;
    this.newPage = isNewTab ? newPageTemp : this.page;
    this.activePage = this.newPage; // update activePage

    if (isNewTab) {
      await this.newPage.waitForLoadState();
    }
  }

  async clickAddToCartAndVerifySuccessMsg() {
    await this.activePage.locator('#add-to-cart-button').first().click();
    await expect(this.activePage.locator('text="Added to cart"')).toBeVisible({ timeout: 2000 })
  }

  async verifyProceedToCheckoutButtonIsPresent() {
    await expect(this.activePage.locator('[data-feature-id="proceed-to-checkout-action"]')).toBeVisible({ timeout: 2000 })
  }

  async clickBuyNow() {
    await this.activePage.locator('#buy-now-button').click()
  }

  async verifyRedirectsToLoginPage() {
    await expect(this.activePage.locator('h1:has-text("Sign in or create account")')).toBeVisible()
    
  }


}
//module.exports = { LoginPage };