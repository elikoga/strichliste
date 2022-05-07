import { expect, test } from '@playwright/test';

test('index page looks good', async ({ page }) => {
  await page.goto('/');
  // it should have a navbar
  const navbar = await page.$('nav');
  expect(navbar).toBeTruthy();
  // and the navbar should link to the index page and the user page
  const navbarLinks = await navbar.$$('a');
  expect(navbarLinks.length).toBe(2);
  expect(await navbarLinks[0].getAttribute('href')).toBe('/');
  expect(await navbarLinks[1].getAttribute('href')).toBe('/user');
});

// test('you can create and delete a user', async ({ page }) => {
//   await page.goto('/user');
//   const createUserButton = await page.$('button');
//   expect(await createUserButton.innerText()).toBe('Create User');
//   await createUserButton.click();
//   // it should have a form
//   const form = await page.$('form');
//   expect(form).toBeTruthy();
//   // and the form should have a username input
//   const usernameInput = await form.$('input[placeholder="Username"]');
//   expect(usernameInput).toBeTruthy();
//   // and the form should have a create button
//   const createButton = await form.$('button');
//   expect(createButton).toBeTruthy();
//   expect(await createButton.innerText()).toBe('Create');
//   // and the form should have a cancel button
//   const cancelButton = (await form.$$('button'))[1];
//   expect(cancelButton).toBeTruthy();
//   expect(await cancelButton.innerText()).toBe('Cancel');
//   // filling the form should create a user
//   await usernameInput.type('testUser');
//   await createButton.click();
//   // and redirect to the user page
//   const user = await page.$('h1');
//   expect(user).toBeTruthy();
//   expect(await user.innerText()).toBe('testUser');
//   // deleting the user should redirect to the index page
//   // the delete account button is in a div with class "deleteUser"
//   const deleteUserButton = await page.$('div.deleteUser button');
//   await deleteUserButton.click();
//   // and we should be back on the user page
//   expect(await page.url()).toBe('http://localhost:3000/user');
//   // and the user should be gone so it should not contain the string "testUser"
//   expect(await page.evaluate(() => document.body.innerHTML)).not.toContain('testUser');
// });
