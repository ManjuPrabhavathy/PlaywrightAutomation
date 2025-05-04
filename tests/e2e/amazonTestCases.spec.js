
import { test, expect } from '@playwright/test';
const { HomePage } = require('../pages/homePage'); // update path as needed

let firstPage;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/amazon\.in/);
  firstPage = new HomePage(page);
});


test('verify amazon.in string in the home page', async ({ page }) => {

  await firstPage.verifyFirmNameInSite()

});
test('verify search bar is empty and clickable', async ({ page }) => {

  await firstPage.verifySearchBarIsEmptyAndClickable()

});

test('verify cart count should be empty first launch', async ({ page }) => {

  await firstPage.verifyCartCount('0')

});

test('select books from search category and verify it is selected', async ({ page }) => {

  await firstPage.selectSearchCategory('Books')

});

test('search books from search bar with search category books', async ({ page }) => {

  await firstPage.selectSearchCategory('Books')
  await firstPage.searchItems('Harry Potter')

});

test('search books and print the total results for the search keyword', async ({ page }) => {

  await firstPage.selectSearchCategory('Books')
  await firstPage.searchItems('Harry Potter')
  const result = await firstPage.getSearchSummaryText()
  console.log('The total results for search keyword : ', result)

});

test('sort results based on selection and verify it is selected', async ({ page }) => {

  await firstPage.selectSearchCategory('Books')
  await firstPage.searchItems('Harry Potter')
  await firstPage.sortByResultsBasedOnSelection('Price: High to Low')
  await firstPage.verifySortBySelection('Price: High to Low')

});

test('click first product after sorting for the search the keyword', async ({ page }) => {

  await firstPage.selectSearchCategory('Books')
  await firstPage.searchItems('Harry Potter')
  await firstPage.sortByResultsBasedOnSelection('Price: High to Low')
  await firstPage.countItemsAndClickFisrtProductFromSearchResults('0')

});

test.only('For the product : click on add to cart, verify success msg and proceed to buy button are present and cart count is 1', async ({ page }) => {

  await firstPage.selectSearchCategory('Books')
  await firstPage.searchItems('Harry Potter')
  await firstPage.sortByResultsBasedOnSelection('Price: High to Low')
  await firstPage.countItemsAndClickFisrtProductFromSearchResults('0')
  await firstPage.clickAddToCartAndVerifySuccessMsg()
  await firstPage.verifyProceedToCheckoutButtonIsPresent()
  await firstPage.verifyCartCount('1')

});

test('click buy now and verify it redirects to login page', async ({ page }) => {

  await firstPage.selectSearchCategory('Books')
  await firstPage.searchItems('Harry Potter')
  await firstPage.sortByResultsBasedOnSelection('Price: High to Low')
  await firstPage.countItemsAndClickFisrtProductFromSearchResults('0')
  await firstPage.clickBuyNow()
  await firstPage.verifyRedirectsToLoginPage()

});
test('Add more than one products on to cart and verify cart count based on added products', async ({ page }) => {
  const searchCategory = 'Books'
  const searchItem = 'mahabharata'
  const sortBy = 'Featured'
  const firstProduct = '0'
  const secProduct = '1'
  const thirdProduct = '2'

  await firstPage.selectSearchCategory(searchCategory)
  await firstPage.searchItems(searchItem)
  await firstPage.sortByResultsBasedOnSelection(sortBy)
  const currentPage = await firstPage.getCurrentPageURL()
  await firstPage.countItemsAndClickFisrtProductFromSearchResults(firstProduct)
  await firstPage.clickAddToCartAndVerifySuccessMsg()
  await firstPage.verifyCartCount('1')
  await page.goto(currentPage)
  await firstPage.countItemsAndClickFisrtProductFromSearchResults(secProduct)
  await firstPage.clickAddToCartAndVerifySuccessMsg()
  await firstPage.verifyCartCount('2')
  await page.goto(currentPage)
  await firstPage.countItemsAndClickFisrtProductFromSearchResults(thirdProduct)
  await firstPage.clickAddToCartAndVerifySuccessMsg()
  await firstPage.verifyCartCount('3')

});

